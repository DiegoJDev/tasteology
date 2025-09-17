import { gateway } from '../services';
import { renderCard } from '../components/Card';
import { analytics } from '../services/Analytics';

export async function initCards() {
  const root = document.querySelector<HTMLElement>('[data-module="cards"]');
  if (!root) return;

  const titleEl = root.querySelector<HTMLElement>('#cards-title');
  const listEl = root.querySelector<HTMLUListElement>('#cards-list');
  if (!listEl) return;

  const { title, cards } = await gateway.getCards();

  // Progressive Enhancement: Update title if different from fallback
  if (titleEl && titleEl.textContent !== title) {
    titleEl.textContent = title;
  }

  // Replace static content with enhanced dynamic content
  listEl.innerHTML = '';
  listEl.setAttribute('role', 'list');
  cards.forEach((card) => listEl.appendChild(renderCard(card)));

  root.addEventListener('click', (ev) => {
    const anchor = (ev.target as HTMLElement).closest('a') as HTMLAnchorElement;

    if (anchor && root.contains(anchor)) {
      ev.preventDefault();

      analytics.logLinkClick(anchor);
    }
  });
}
