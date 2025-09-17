export type ResponsiveSource = { w: number; src: string };

export type GalleryImage = {
  id: 'left' | 'rightTop' | 'rightBottom';
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  sources: ResponsiveSource[];
};

export type FeatureCopy = {
  title: string;
  bodyHtml: string;
  kicker: string;
  headline: string;
};

export type GalleryPayload = {
  feature: FeatureCopy;
  images: GalleryImage[];
};

//Card
export type CardImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sources: ResponsiveSource[];
};

export type CardLink = {
  href: string;
  label: string;
  rel?: string;
  target?: '_self' | '_blank';
  title?: string;
  download?: boolean;
  external?: boolean;
  ariaLabel?: string;
};

export type CardsPayload = {
  title: string;
  cards: Card[];
};

export type Card = {
  id: string;
  title: string;
  body: string;
  image: CardImage;
  link?: CardLink | null;
};
