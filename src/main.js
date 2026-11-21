/* ==========================================================================
   SRC/MAIN.JS - MASTER CHRISTMAS CITY PARTICLE ARTWORK ORCHESTRATOR
   Compiles and renders the entire Point Cloud Christmas Village at 60 FPS.
   ========================================================================== */

import { WorldScene } from "./scene.js";
import { CameraSystem } from "./camera.js";
import { LightingSystem } from "./lighting.js";
import { ParticleEngine } from "./particleEngine.js";
import { ParticleChristmasTree } from "./christmasTree.js";
import { ParticleBuildingGenerator } from "./buildings.js";
import { ParticleDecorations } from "./decorations.js";
import { CityGenerator } from "./cityGenerator.js";
import { SnowfallEngine } from "./snow.js";
import { ControlsManager } from "./controls.js";
import { UIManager } from "./ui.js";

class ChristmasCityApp {
  constructor() {
    this.container = document.getElementById("city-canvas-container");
    if (!this.container) {
      console.error("Fatal: #city-canvas-container element not found in DOM");
      return;
    }

    // 1. Scene, Camera & Lighting Systems
    this.sceneManager = new WorldScene(this.container);
    this.cameraManager = new CameraSystem(this.sceneManager.width, this.sceneManager.height);
    this.lightingManager = new LightingSystem(this.sceneManager.scene);

    // 2. Master Particle Cloud Engine
    this.particleEngine = new ParticleEngine(this.sceneManager.scene);

    // 3. Sub-generators (Tree, Buildings, Decorations)
    this.treeGenerator = new ParticleChristmasTree(this.particleEngine, this.lightingManager);
    this.buildingGenerator = new ParticleBuildingGenerator(this.particleEngine);
    this.decorationGenerator = new ParticleDecorations(this.particleEngine, this.lightingManager);

    // 4. Procedural Village Master Assembly
    this.cityGenerator = new CityGenerator(
      this.particleEngine,
      this.buildingGenerator,
      this.decorationGenerator,
      this.treeGenerator
    );
    this.cityGenerator.generateCity();

    // 5. Compile All Particles into GPU Point Cloud (1 Single Draw Call!)
    this.particleEngine.compile();

    // 6. Continuous Falling Snow Particle System
    this.snowEngine = new SnowfallEngine(this.sceneManager.scene, this.particleEngine.glowTexture);

    // 7. Interactive Controls & UI Manager
    this.controlsManager = new ControlsManager(
      this.cameraManager.camera,
      this.sceneManager.renderer.domElement,
      () => this.cameraManager.reset()
    );
    this.uiManager = new UIManager(this);

    // Animation & State
    this.autoRotate = false;
    this.rotSpeed = 0.0018;
    this.lastTime = performance.now();

    this.bindEvents();
    this.animate();

    console.log("%c[ChristmasCityApp] Point Cloud Christmas City loaded at 60 FPS.", "color: #10b981; font-weight: bold; font-size: 14px;");
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.sceneManager.handleResize(width, height);
      this.cameraManager.handleResize(width, height);
    });
  }

  resetCamera() {
    this.cameraManager.reset();
    if (this.controlsManager) {
      this.controlsManager.reset();
    }
  }

  toggleSnow() {
    return this.snowEngine.toggle();
  }

  toggleAsciiMode() {
    return this.particleEngine.toggleAsciiMode();
  }

  takeSnapshot() {
    this.sceneManager.render(this.cameraManager.camera);
    const dataUrl = this.sceneManager.renderer.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `christmas-city-particles-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // 1. Camera Drift Update
    this.cameraManager.update(delta);

    // 2. Controls Update
    if (this.controlsManager) {
      this.controlsManager.update();
    }

    // 3. Update Point Cloud Particle Shader (Twinkle, Shimmer)
    if (this.particleEngine) {
      this.particleEngine.update(delta);
    }

    // 4. Update Falling Snow Particles
    if (this.snowEngine) {
      this.snowEngine.update(delta);
    }

    // 5. Auto-rotate Scene if active
    if (this.autoRotate && this.particleEngine.pointsMesh) {
      this.particleEngine.pointsMesh.rotation.y += this.rotSpeed;
    }

    // 6. Render Scene
    this.sceneManager.render(this.cameraManager.camera);
  }
}

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new ChristmasCityApp();
});
