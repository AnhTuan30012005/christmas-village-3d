/* ==========================================================================
   SRC/LIGHTING.JS - SUBTLE NIGHT LIGHTING & GLOW HALO GENERATOR
   ========================================================================== */

const THREE = window.THREE;

export class LightingSystem {
  constructor(scene) {
    this.scene = scene;
    this.initLights();
    this.initGlowTextures();
  }

  initLights() {
    // 1. Dark Midnight Ambient (Keeps scene dark so particles shine brilliantly)
    this.ambientLight = new THREE.AmbientLight(0x040814, 0.25);
    this.scene.add(this.ambientLight);

    // 2. Cool Blue Moonlight (Very subtle directional accent)
    this.moonLight = new THREE.DirectionalLight(0x405a80, 0.45);
    this.moonLight.position.set(-16, 26, 14);
    this.scene.add(this.moonLight);
  }

  initGlowTextures() {
    this.glowTexWarm = this.createGlowCanvas("rgba(255, 175, 40, 1.0)");
    this.glowTexGold = this.createGlowCanvas("rgba(255, 215, 65, 1.0)");
  }

  createGlowCanvas(colorStr, innerAlpha = 0.85) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, colorStr);
    gradient.addColorStop(0.22, colorStr.replace(/[\d\.]+\)$/, (innerAlpha * 0.72) + ")"));
    gradient.addColorStop(0.55, colorStr.replace(/[\d\.]+\)$/, (innerAlpha * 0.18) + ")"));
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }

  createGlowSprite(size, texture = this.glowTexWarm, opacity = 0.85) {
    const mat = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(size, size, 1);
    return sprite;
  }
}
