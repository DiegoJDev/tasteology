export class GalleryModal {
  private modal: HTMLElement;
  private modalImage: HTMLImageElement;
  private closeButton: HTMLButtonElement;

  constructor() {
    this.modal = document.getElementById('gallery-modal') as HTMLElement;
    this.modalImage = document.getElementById('modal-image') as HTMLImageElement;
    this.closeButton = this.modal.querySelector('.modal__close') as HTMLButtonElement;

    this.initEventListeners();
  }

  private initEventListeners(): void {
    this.closeButton.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open(imageSrc: string, imageAlt: string): void {
    this.modalImage.src = imageSrc;
    this.modalImage.alt = imageAlt;

    this.modal.classList.add('modal--open');
    this.modal.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';

    this.closeButton.focus();
  }

  close(): void {
    this.modal.classList.remove('modal--open');
    this.modal.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

    setTimeout(() => {
      if (!this.isOpen()) {
        this.modalImage.src = '';
        this.modalImage.alt = '';
      }
    }, 300);
  }

  private isOpen(): boolean {
    return this.modal.classList.contains('modal--open');
  }
}
