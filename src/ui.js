/* ==========================================================================
   SRC/UI.JS - INTERACTIVE CONTROL DOCK & WISH MODAL
   ========================================================================== */

export class UIManager {
  constructor(app) {
    this.app = app;
    this.bindButtons();
  }

  bindButtons() {
    // 1. Reset Camera View
    const btnReset = document.getElementById("btn-cam-photo");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        this.app.resetCamera();
      });
    }

    // 2. Auto Rotate Toggle
    const btnAutoRot = document.getElementById("btn-autorotate");
    if (btnAutoRot) {
      btnAutoRot.addEventListener("click", () => {
        this.app.autoRotate = !this.app.autoRotate;
        btnAutoRot.classList.toggle("active", this.app.autoRotate);
      });
    }

    // 3. Snow Toggle
    const btnSnow = document.getElementById("btn-snow");
    const snowState = document.getElementById("snow-state");
    if (btnSnow) {
      btnSnow.addEventListener("click", () => {
        const state = this.app.toggleSnow();
        if (snowState) snowState.textContent = state ? "Bật" : "Tắt";
        btnSnow.classList.toggle("active", state);
      });
    }

    // 4. ASCII / Particle Mode Toggle
    const btnAscii = document.getElementById("btn-ascii");
    const asciiState = document.getElementById("ascii-state");
    if (btnAscii) {
      btnAscii.addEventListener("click", () => {
        const isAscii = this.app.toggleAsciiMode();
        if (asciiState) asciiState.textContent = isAscii ? "ASCII ✦" : "Hạt Sáng ✨";
        btnAscii.classList.toggle("active", isAscii);
      });
    }

    // 5. High-Res Snapshot
    const btnSnapshot = document.getElementById("btn-snapshot");
    if (btnSnapshot) {
      btnSnapshot.addEventListener("click", () => {
        this.app.takeSnapshot();
      });
    }

    // 6. Audio Controller
    const btnAudio = document.getElementById("btn-audio");
    const audioEl = document.getElementById("bgMusic");
    const audioPill = document.getElementById("audio-pill");
    if (btnAudio && audioEl) {
      let isPlaying = false;
      btnAudio.addEventListener("click", () => {
        if (!isPlaying) {
          audioEl.play().then(() => {
            isPlaying = true;
            if (audioPill) audioPill.classList.add("audio-playing");
            btnAudio.textContent = "⏸ Pause Sound";
          }).catch(err => {
            console.warn("Autoplay blocked:", err);
          });
        } else {
          audioEl.pause();
          isPlaying = false;
          if (audioPill) audioPill.classList.remove("audio-playing");
          btnAudio.textContent = "▶ Play Sound";
        }
      });
    }

    // 7. Custom Wish Modal Dialog
    const modal = document.getElementById("wish-modal");
    const btnOpenWish = document.getElementById("btn-open-wish");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const btnSaveWish = document.getElementById("btn-save-wish");
    const inputTitle = document.getElementById("input-wish-title");
    const inputSub = document.getElementById("input-wish-sub");
    const displayTitle = document.getElementById("display-wish-title");
    const displaySub = document.getElementById("display-wish-sub");

    if (btnOpenWish && modal) {
      btnOpenWish.addEventListener("click", () => modal.classList.add("open"));
    }
    if (btnCloseModal && modal) {
      btnCloseModal.addEventListener("click", () => modal.classList.remove("open"));
    }
    if (btnSaveWish && modal && inputTitle && displayTitle) {
      btnSaveWish.addEventListener("click", () => {
        displayTitle.textContent = `🎄 ${inputTitle.value.trim()} 🎄`;
        if (displaySub && inputSub) displaySub.textContent = inputSub.value.trim();
        modal.classList.remove("open");
      });
    }
  }
}
