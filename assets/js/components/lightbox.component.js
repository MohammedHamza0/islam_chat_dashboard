/**
 * LightboxComponent: Zoomable High-Resolution Chart Lightbox
 */
window.LightboxComponent = {
  open(imgSrc) {
    const modal = document.getElementById("lightbox-modal");
    const img = document.getElementById("lightbox-img");
    if (modal && img) {
      img.src = imgSrc;
      modal.classList.add("active");
    }
  },

  close() {
    const modal = document.getElementById("lightbox-modal");
    if (modal) {
      modal.classList.remove("active");
    }
  }
};
