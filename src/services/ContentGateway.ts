import type { GalleryPayload, CardsPayload } from '../types/content';

export interface ContentGateway {
  getGallery(): Promise<GalleryPayload>;
  getCards(): Promise<CardsPayload>;
}
