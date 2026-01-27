/* ========================================
   Photography Portfolio - Slideshow Logic
   ======================================== */

class Slideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.counter = document.querySelector('.photo-counter');
        this.nav = document.querySelector('.nav');
        this.arrows = document.querySelectorAll('.nav-arrow');

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.isAutoPlaying = false;

        this.hideUITimeout = null;
        this.uiHideDelay = 3000;

        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;

        this.init();
    }

    init() {
        if (this.totalSlides === 0) return;

        this.showSlide(0);
        this.updateCounter();
        this.preloadImages();
        this.bindEvents();
        this.startUIHideTimer();
        this.startAutoPlay();
    }

    bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Click areas
        document.querySelectorAll('.click-area').forEach(area => {
            area.addEventListener('click', (e) => {
                if (area.classList.contains('prev')) {
                    this.prev();
                } else {
                    this.next();
                }
            });
        });

        // Arrow buttons
        document.querySelector('.nav-arrow.prev')?.addEventListener('click', () => this.prev());
        document.querySelector('.nav-arrow.next')?.addEventListener('click', () => this.next());

        // Touch events
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Mouse movement shows UI
        document.addEventListener('mousemove', () => this.showUI());
        document.addEventListener('click', () => this.showUI());
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.prev();
                break;
            case 'ArrowRight':
                this.next();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoPlay();
                break;
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > this.minSwipeDistance) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    showSlide(index) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        // Remove active from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));

        // Normalize index
        if (index >= this.totalSlides) {
            this.currentIndex = 0;
        } else if (index < 0) {
            this.currentIndex = this.totalSlides - 1;
        } else {
            this.currentIndex = index;
        }

        // Show current slide
        this.slides[this.currentIndex].classList.add('active');
        this.updateCounter();

        // Preload adjacent images
        this.preloadAdjacent();

        // Reset transition lock
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    next() {
        this.showSlide(this.currentIndex + 1);
        this.showUI();
    }

    prev() {
        this.showSlide(this.currentIndex - 1);
        this.showUI();
    }

    updateCounter() {
        if (this.counter) {
            const current = String(this.currentIndex + 1).padStart(2, '0');
            const total = String(this.totalSlides).padStart(2, '0');
            this.counter.textContent = `${current} / ${total}`;
        }
    }

    preloadImages() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && img.dataset.src) {
                const preload = new Image();
                preload.src = img.dataset.src;
            }
        });
    }

    preloadAdjacent() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;

        [nextIndex, prevIndex].forEach(index => {
            const img = this.slides[index]?.querySelector('img');
            if (img && !img.complete) {
                img.loading = 'eager';
            }
        });
    }

    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    startAutoPlay() {
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        this.isAutoPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    showUI() {
        // Show navigation elements
        this.nav?.classList.remove('hidden');
        this.counter?.classList.remove('hidden');
        this.arrows.forEach(arrow => arrow.classList.add('visible'));

        // Reset hide timer
        this.startUIHideTimer();
    }

    hideUI() {
        this.nav?.classList.add('hidden');
        this.counter?.classList.add('hidden');
        this.arrows.forEach(arrow => arrow.classList.remove('visible'));
    }

    startUIHideTimer() {
        if (this.hideUITimeout) {
            clearTimeout(this.hideUITimeout);
        }

        this.hideUITimeout = setTimeout(() => {
            this.hideUI();
        }, this.uiHideDelay);
    }
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        window.slideshow = new Slideshow();
    }
});
