import type { ContentGateway } from './ContentGateway';
import type { CardsPayload, GalleryPayload } from '../types/content';

export class JsonContentGateway implements ContentGateway {
  constructor(private base = '/data') {}

  async getGallery(): Promise<GalleryPayload> {
    const res = await fetch(`${this.base}/gallery.json`);
    if (!res.ok) throw new Error('Gallery JSON not found');
    return res.json();
  }

  async getCards(): Promise<CardsPayload> {
    const res = await fetch(`${this.base}/cards.json`);
    if (!res.ok) throw new Error('Cards JSON not found');
    return res.json();
  }
}
