/* ========================================
   Photography Portfolio - Collections Viewer
   ======================================== */

class CollectionsViewer {
    constructor() {
        this.viewer = document.getElementById('photoViewer');
        this.viewerImg = this.viewer.querySelector('.photo-viewer-content img');
        this.viewerCounter = this.viewer.querySelector('.photo-viewer-counter');
        this.closeBtn = this.viewer.querySelector('.photo-viewer-close');
        this.prevBtn = this.viewer.querySelector('.photo-viewer-arrow.prev');
        this.nextBtn = this.viewer.querySelector('.photo-viewer-arrow.next');

        this.activeCollection = null;
        this.activePhotos = [];
        this.currentIndex = 0;

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Click on thumbnails to open viewer
        document.querySelectorAll('.collection-photos img').forEach(img => {
            img.addEventListener('click', (e) => this.openViewer(e.target));
        });

        // Close button
        this.closeBtn.addEventListener('click', () => this.closeViewer());

        // Navigation arrows
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Click outside to close
        this.viewer.addEventListener('click', (e) => {
            if (e.target === this.viewer) {
                this.closeViewer();
            }
        });
    }

    openViewer(clickedImg) {
        // Find the collection this image belongs to
        const collection = clickedImg.closest('.collection');
        this.activeCollection = collection;
        this.activePhotos = Array.from(collection.querySelectorAll('.collection-photos img'));
        this.currentIndex = this.activePhotos.indexOf(clickedImg);

        // Show the viewer
        this.showPhoto(this.currentIndex);
        this.viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeViewer() {
        this.viewer.classList.remove('active');
        document.body.style.overflow = '';
        this.activeCollection = null;
        this.activePhotos = [];
        this.currentIndex = 0;
    }

    showPhoto(index) {
        if (index < 0) {
            this.currentIndex = this.activePhotos.length - 1;
        } else if (index >= this.activePhotos.length) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = index;
        }

        const photo = this.activePhotos[this.currentIndex];
        this.viewerImg.src = photo.src;
        this.viewerImg.alt = photo.alt;
        this.updateCounter();
    }

    updateCounter() {
        const current = String(this.currentIndex + 1).padStart(2, '0');
        const total = String(this.activePhotos.length).padStart(2, '0');
        this.viewerCounter.textContent = `${current} / ${total}`;
    }

    prev() {
        if (!this.viewer.classList.contains('active')) return;
        this.showPhoto(this.currentIndex - 1);
    }

    next() {
        if (!this.viewer.classList.contains('active')) return;
        this.showPhoto(this.currentIndex + 1);
    }

    handleKeyboard(e) {
        if (!this.viewer.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                this.closeViewer();
                break;
            case 'ArrowLeft':
                this.prev();
                break;
            case 'ArrowRight':
                this.next();
                break;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CollectionsViewer();
});
