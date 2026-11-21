/* ==========================================================================
   SRC/PARTICLEENGINE.JS - MASTER POINT CLOUD & SHADER ENGINE (REFINED)
   Renders dense volumetric particle silhouettes with crisp, delicate light points.
   ========================================================================== */

const THREE = window.THREE;
const TAU = 2 * Math.PI;

export class ParticleEngine {
  constructor(scene) {
    this.scene = scene;
    this.time = 0;

    // Master Particle Buffers
    this.positions = [];
    this.colors = [];
    this.sizes = [];
    this.phases = [];
    this.speeds = [];
    this.types = []; // 0: structure/mass, 1: fairy light, 2: star/glow, 3: subtle atmospheric

    // Textures
    this.glowTexture = this.createSoftGlowTexture();
    this.asciiTexture = this.createAsciiAtlasTexture();
    this.asciiMode = false;
  }

  // Crisp luminous core with tight, controlled glow falloff (prevents muddy over-bloom)
  createSoftGlowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
    grad.addColorStop(0.22, "rgba(255, 255, 255, 0.92)");
    grad.addColorStop(0.45, "rgba(255, 255, 255, 0.35)");
    grad.addColorStop(0.75, "rgba(255, 255, 255, 0.06)");
    grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  // ASCII Star/Sparkle Glyph Texture
  createAsciiAtlasTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 128, 128);

    ctx.font = "bold 92px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
    ctx.shadowBlur = 8;
    ctx.fillText("✦", 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  // Add a single particle to the master batch
  addParticle(x, y, z, colorHex, size = 0.20, type = 0, speed = 1.0, phase = Math.random() * TAU) {
    this.positions.push(x, y, z);

    const col = new THREE.Color(colorHex);
    this.colors.push(col.r, col.g, col.b);

    this.sizes.push(size);
    this.phases.push(phase);
    this.speeds.push(speed);
    this.types.push(type);
  }

  // Add particle with direct RGB floats (fast, zero Color allocation for dense fills)
  addParticleRGB(x, y, z, r, g, b, size = 0.20, type = 0, speed = 1.0, phase = Math.random() * TAU) {
    this.positions.push(x, y, z);
    this.colors.push(r, g, b);
    this.sizes.push(size);
    this.phases.push(phase);
    this.speeds.push(speed);
    this.types.push(type);
  }

  compile() {
    const count = this.positions.length / 3;
    console.log(`[ParticleEngine] Compiling ${count.toLocaleString()} particles into GPU Point Cloud...`);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.positions, 3));
    this.geometry.setAttribute("color", new THREE.Float32BufferAttribute(this.colors, 3));
    this.geometry.setAttribute("size", new THREE.Float32BufferAttribute(this.sizes, 1));
    this.geometry.setAttribute("phase", new THREE.Float32BufferAttribute(this.phases, 1));
    this.geometry.setAttribute("speed", new THREE.Float32BufferAttribute(this.speeds, 1));
    this.geometry.setAttribute("type", new THREE.Float32BufferAttribute(this.types, 1));

    this.material = new THREE.ShaderMaterial({
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uTexture: { value: this.glowTexture },
        uTwinkleEnabled: { value: 1.0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uTwinkleEnabled;

        attribute float size;
        attribute float phase;
        attribute float speed;
        attribute float type;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = max(-mvPosition.z, 1.0);

          float twinkle = 1.0;
          if (uTwinkleEnabled > 0.5) {
            if (type > 0.5 && type < 1.5) {
              // Fairy lights: subtle festive twinkle
              twinkle = 0.55 + 0.45 * (0.5 + 0.5 * sin(uTime * speed * 3.6 + phase));
            } else if (type > 1.5 && type < 2.5) {
              // Star sparkles: refined shimmer
              twinkle = 0.72 + 0.28 * (0.5 + 0.5 * sin(uTime * speed * 3.2 + phase));
            } else {
              // Structural mass: calm breathing
              twinkle = 0.94 + 0.06 * sin(uTime * 1.2 + phase);
            }
          }

          // Smooth atmospheric depth fade across Z=0 to Z=-70
          float depthFade = clamp(1.18 - dist * 0.0075, 0.24, 1.0);

          float pSize = size * uPixelRatio * (460.0 / dist) * (0.85 + 0.15 * twinkle);
          gl_PointSize = clamp(pSize, 1.0, 24.0);
          gl_Position = projectionMatrix * mvPosition;

          vAlpha = twinkle * depthFade;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          if (texColor.a < 0.04) discard;

          // Subtle, refined luminosity without washing out into white blobs
          vec3 outColor = vColor * (0.98 + texColor.r * 0.32);
          gl_FragColor = vec4(outColor, texColor.a * vAlpha * 0.92);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pointsMesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.pointsMesh);

    return this.pointsMesh;
  }

  toggleAsciiMode() {
    this.asciiMode = !this.asciiMode;
    if (this.material && this.material.uniforms.uTexture) {
      this.material.uniforms.uTexture.value = this.asciiMode ? this.asciiTexture : this.glowTexture;
    }
    return this.asciiMode;
  }

  toggleTwinkle(enabled) {
    if (this.material && this.material.uniforms.uTwinkleEnabled) {
      this.material.uniforms.uTwinkleEnabled.value = enabled ? 1.0 : 0.0;
    }
  }

  update(delta) {
    this.time += delta;
    if (this.material && this.material.uniforms.uTime) {
      this.material.uniforms.uTime.value = this.time;
    }
  }
}
