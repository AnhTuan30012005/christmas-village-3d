/* ==========================================================================
   SRC/SNOW.JS - ATMOSPHERIC FALLING 3D SNOWFALL PARTICLE ENGINE (REFINED)
   Many fine small flakes, some medium flakes, very few large flakes.
   Clamped size prevents foreground snowflakes from obscuring the city.
   ========================================================================== */

const THREE = window.THREE;
const TAU = 2 * Math.PI;

export class SnowfallEngine {
  constructor(scene, glowTexture) {
    this.scene = scene;
    this.glowTexture = glowTexture || this.createSnowTexture();
    this.count = 2600;
    this.time = 0;
    this.enabled = true;

    this.initSnowParticles();
  }

  createSnowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
    grad.addColorStop(0.35, "rgba(240, 248, 255, 0.8)");
    grad.addColorStop(0.7, "rgba(210, 235, 255, 0.2)");
    grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  initSnowParticles() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const speeds = new Float32Array(this.count);
    const sways = new Float32Array(this.count);
    const sizes = new Float32Array(this.count);
    const alphas = new Float32Array(this.count);

    this.bounds = {
      xMin: -46, xMax: 46,
      yMin: 0,   yMax: 30,
      zMin: -62, zMax: 20 // Covers deep city without blocking immediate camera lens
    };

    for (let i = 0; i < this.count; i++) {
      positions[i * 3]     = this.bounds.xMin + Math.random() * (this.bounds.xMax - this.bounds.xMin);
      positions[i * 3 + 1] = this.bounds.yMin + Math.random() * (this.bounds.yMax - this.bounds.yMin);
      positions[i * 3 + 2] = this.bounds.zMin + Math.random() * (this.bounds.zMax - this.bounds.zMin);

      // Size distribution: 75% small, 21% medium, 4% slightly larger
      const r = Math.random();
      if (r < 0.75) {
        sizes[i] = 0.11 + Math.random() * 0.06;
        alphas[i] = 0.48 + Math.random() * 0.35;
        speeds[i] = 0.025 + Math.random() * 0.035;
      } else if (r < 0.96) {
        sizes[i] = 0.18 + Math.random() * 0.07;
        alphas[i] = 0.58 + Math.random() * 0.30;
        speeds[i] = 0.045 + Math.random() * 0.035;
      } else {
        sizes[i] = 0.26 + Math.random() * 0.06;
        alphas[i] = 0.65 + Math.random() * 0.25;
        speeds[i] = 0.060 + Math.random() * 0.030;
      }

      sways[i] = Math.random() * TAU;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    this.speeds = speeds;
    this.sways = sways;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uTexture: { value: this.glowTexture }
      },
      vertexShader: `
        uniform float uPixelRatio;
        attribute float aSize;
        attribute float aAlpha;
        varying float vAlpha;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = max(-mvPosition.z, 2.0);
          // Fade out flakes that get too close to camera so they never block view
          float nearFade = smoothstep(3.0, 10.0, dist);
          float pSize = aSize * uPixelRatio * (340.0 / dist);
          gl_PointSize = clamp(pSize, 1.0, 9.5);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = aAlpha * nearFade;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying float vAlpha;

        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          if (tex.a < 0.04) discard;
          gl_FragColor = vec4(0.92, 0.96, 1.0, tex.a * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(geo, mat);
    this.scene.add(this.points);
  }

  toggle(enabled) {
    this.enabled = (enabled !== undefined) ? enabled : !this.enabled;
    if (this.points) {
      this.points.visible = this.enabled;
    }
    return this.enabled;
  }

  update(delta) {
    if (!this.enabled || !this.points) return;

    this.time += delta;
    const positions = this.points.geometry.attributes.position.array;
    const wind = Math.sin(this.time * 0.45) * 0.022;

    for (let i = 0; i < this.count; i++) {
      positions[i * 3 + 1] -= this.speeds[i];
      positions[i * 3]     += wind + Math.sin(this.time * 1.2 + this.sways[i]) * 0.012;

      if (positions[i * 3 + 1] < this.bounds.yMin) {
        positions[i * 3 + 1] = this.bounds.yMax;
        positions[i * 3]     = this.bounds.xMin + Math.random() * (this.bounds.xMax - this.bounds.xMin);
        positions[i * 3 + 2] = this.bounds.zMin + Math.random() * (this.bounds.zMax - this.bounds.zMin);
      }
    }

    this.points.geometry.attributes.position.needsUpdate = true;
  }
}
