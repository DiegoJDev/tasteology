import type { GalleryPayload, GalleryImage } from '../types/content';
import { GalleryModal } from '../components/Modal';
import { gateway } from '../services';

export default class Gallery {
  private root: HTMLElement;
  private listEl: HTMLUListElement | null;
  private modal: GalleryModal;

  constructor(root: HTMLElement) {
    this.root = root;
    this.listEl = root.querySelector<HTMLUListElement>('#gallery-list');
    this.modal = new GalleryModal();
  }

  async init() {
    this.showLoading();

    try {
      const data = await gateway.getGallery();
      this.hideLoading();
      this.renderCopy(data);
      this.renderImages(data.images);
      this.addFadeInAnimation();
    } catch (error) {
      this.hideLoading();
      this.showError('Failed to load gallery content');
      // eslint-disable-next-line no-console
      console.error('Gallery loading error:', error);
    }
  }

  private renderCopy(data: GalleryPayload) {
    const title = this.root.querySelector<HTMLElement>('#feature-title');
    const text = this.root.querySelector<HTMLElement>('#feature-text');
    const kicker = this.root.querySelector<HTMLElement>('#feature-kicker');
    const headline = this.root.querySelector<HTMLElement>('#feature-headline');

    // Progressive Enhancement: Only update if content differs from fallback
    if (title) {
      title.innerHTML = `
        <div class="headline">
          <h1 class="section__title">${data.feature.title}</h1>
        </div>
      `;
    }

    // Replace with dynamic content from CMS
    if (text) text.innerHTML = data.feature.bodyHtml;
    if (kicker) kicker.textContent = data.feature.kicker;
    if (headline) headline.textContent = data.feature.headline;
  }

  private renderImages(images: GalleryImage[]) {
    if (!this.listEl) return;
    this.listEl.innerHTML = images.map((img) => this.itemHTML(img)).join('');
    this.attachImageListeners();
  }

  private attachImageListeners() {
    if (!this.listEl) return;

    this.listEl.addEventListener('click', (e) => {
      const img = (e.target as HTMLElement).closest('img') as HTMLImageElement;
      if (img) {
        const largestSrc = this.getLargestImageSrc(img);
        this.modal.open(largestSrc, img.alt);
      }
    });
  }

  private getLargestImageSrc(img: HTMLImageElement): string {
    const srcset = img.srcset;
    if (srcset) {
      const sources = srcset.split(',').map((s) => s.trim());
      const largest = sources[sources.length - 1];
      return largest.split(' ')[0];
    }
    return img.src;
  }

  private itemHTML(img: GalleryImage) {
    const srcset = img.sources.map((s) => `${s.src} ${s.w}w`).join(', ');
    const sizes = img.sizes ?? '100vw';

    return `
      <li class="feature__item feature__item--${img.id}">
        <img
          src="${img.sources[0].src}"
          srcset="${srcset}"
          sizes="${sizes}"
          alt="${this.escapeAttr(img.alt)}"
          width="${img.width}" height="${img.height}"
          loading="lazy" decoding="async"
        />
      </li>
    `;
  }

  private escapeAttr(s: string) {
    return s.replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  }

  private showLoading(): void {
    if (!this.listEl) return;

    this.listEl.innerHTML = `
      <div class="skeleton skeleton-gallery">
        <div class="skeleton skeleton-image-large"></div>
        <div class="skeleton skeleton-image-small"></div>
        <div class="skeleton skeleton-image-small"></div>
      </div>
    `;
  }

  private hideLoading(): void {
    const skeleton = this.root.querySelector('.skeleton-gallery');
    if (skeleton) {
      skeleton.remove();
    }
  }

  private showError(message: string): void {
    if (!this.listEl) return;

    this.listEl.innerHTML = `
      <div class="loading">
        <div style="text-align: center; color: var(--color-accent);">
          <p>⚠️ ${message}</p>
          <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--color-accent); color: white; border: none; border-radius: var(--radius); cursor: pointer;">
            Try Again
          </button>
        </div>
      </div>
    `;
  }

  private addFadeInAnimation(): void {
    const images = this.root.querySelectorAll('.feature__item');
    images.forEach((img, index) => {
      setTimeout(() => {
        img.classList.add('fade-in');
      }, index * 100);
    });
  }
}
