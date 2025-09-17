import type { Card } from '../types/content';

function buildSrcSet(sources: Card['image']['sources']): string {
  return sources.map((s) => `${s.src} ${s.w}w`).join(', ');
}

const CARD_SIZES = '(min-width: 1024px) 375px, (min-width: 768px) 45vw, 90vw';

export function renderCard(card: Card): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'card';
  li.setAttribute('data-card-id', card.id);

  const article = document.createElement('article');
  article.className = 'card__inner';

  const img = document.createElement('img');
  img.className = 'card__img';
  img.decoding = 'async';
  img.loading = 'lazy';
  img.alt = card.image.alt;
  img.src = card.image.src;
  img.srcset = buildSrcSet(card.image.sources);
  img.sizes = CARD_SIZES;

  const figure = document.createElement('figure');
  figure.className = 'card__media';
  figure.appendChild(img);

  const h3 = document.createElement('h3');
  h3.className = 'card__title';
  h3.textContent = card.title;

  const p = document.createElement('p');
  p.className = 'card__body';
  p.textContent = card.body;

  let link: HTMLAnchorElement | null = null;
  if (card.link?.href) {
    link = document.createElement('a');
    link.className = 'card__link';
    link.href = card.link.href;

    // Accessibility & SEO standards
    link.setAttribute('aria-label', card.link.ariaLabel || `Read more about ${card.title}`);
    if (card.link.title) link.title = card.link.title;

    // External link standards
    if (card.link.external || card.link.target === '_blank') {
      link.target = '_blank';
      link.rel = card.link.rel || 'noopener noreferrer';
      link.setAttribute('aria-describedby', 'external-link-desc');
    } else if (card.link.rel) {
      link.rel = card.link.rel;
    }

    // Download link standards
    if (card.link.download) {
      link.download = '';
    }

    // Analytics & tracking attributes
    link.setAttribute('data-card-id', card.id);
    link.setAttribute('data-link-type', 'card-link');
    link.setAttribute('data-link-destination', card.link.href);

    link.append(h3);
  }

  const caption = document.createElement('div');
  caption.className = 'card__caption';
  caption.append(link ?? h3, p);

  article.append(figure, caption);
  li.appendChild(article);
  return li;
}
