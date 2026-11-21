/* ==========================================================================
   SRC/CAMERA.JS - CINEMATIC WIDE-ANGLE CAMERA
   Frames the entire Christmas Village in depth: foreground plaza, central hero tree,
   and layered background cottages, clock tower & cathedral spires.
   ========================================================================== */

const THREE = window.THREE;

export class CameraSystem {
  constructor(width, height) {
    this.defaultPos = new THREE.Vector3(0, 10.6, 31.5);
    this.defaultTarget = new THREE.Vector3(0, 3.0, -8.0);

    this.camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 260);
    this.camera.position.copy(this.defaultPos);

    this.time = 0;
    this.driftEnabled = true;
  }

  update(delta) {
    this.time += delta;
    if (this.driftEnabled) {
      // Extremely subtle, cinematic gentle drift
      const swayX = Math.sin(this.time * 0.12) * 0.18;
      const swayY = Math.cos(this.time * 0.16) * 0.10;
      this.camera.position.x = this.defaultPos.x + swayX;
      this.camera.position.y = this.defaultPos.y + swayY;
    }
  }

  reset() {
    this.camera.position.copy(this.defaultPos);
  }

  handleResize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
