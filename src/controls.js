/* ==========================================================================
   SRC/CONTROLS.JS - ORBIT CONTROLS & USER INTERACTION (PHASE 1 & 2)
   ========================================================================== */

const THREE = window.THREE;

export class ControlsManager {
  constructor(camera, domElement, onReset) {
    this.camera = camera;
    this.domElement = domElement;
    this.onReset = onReset;

    this.initControls();
    this.bindEvents();
  }

  initControls() {
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
      this.controls.minDistance = 8;
      this.controls.maxDistance = 58;
      this.controls.target.set(0, 3.0, -8.0);
    }
  }

  bindEvents() {
    // Double click to reset camera position
    this.domElement.addEventListener("dblclick", () => {
      this.reset();
    });
  }

  reset() {
    if (this.controls) {
      this.controls.target.set(0, 3.0, -8.0);
      this.controls.update();
    }
    if (this.onReset) this.onReset();
  }

  update() {
    if (this.controls) {
      this.controls.update();
    }
  }
}
