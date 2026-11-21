/* ==========================================================================
   SRC/SCENE.JS - PURE PARTICLE NIGHT SKY & SCENE ENVIRONMENT
   Zero solid box meshes. Pitch-black winter night sky with subtle winter fog.
   ========================================================================== */

const THREE = window.THREE;

export class WorldScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    this.initScene();
    this.initRenderer();
  }

  initScene() {
    this.scene = new THREE.Scene();
    // Deep midnight black sky with gentle atmospheric fog allowing distant city up to Z=-70
    this.scene.background = new THREE.Color(0x010206);
    this.scene.fog = new THREE.FogExp2(0x010206, 0.0075);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.appendChild(this.renderer.domElement);
  }

  handleResize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
  }

  render(camera) {
    this.renderer.render(this.scene, camera);
  }
}
