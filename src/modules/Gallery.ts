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
    const data = await gateway.getGallery();
    this.renderCopy(data);
    this.renderImages(data.images);
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
}
