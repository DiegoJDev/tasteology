import { gateway } from '../services';
import { renderCard } from '../components/Card';
import { analytics } from '../services/Analytics';

export async function initCards() {
  const root = document.querySelector<HTMLElement>('[data-module="cards"]');
  if (!root) return;

  const titleEl = root.querySelector<HTMLElement>('#cards-title');
  const listEl = root.querySelector<HTMLUListElement>('#cards-list');
  if (!listEl) return;

  // Show loading state
  showCardsLoading(listEl);

  try {
    const { title, cards } = await gateway.getCards();

    // Progressive Enhancement: Update title if different from fallback
    if (titleEl && titleEl.textContent !== title) {
      titleEl.textContent = title;
    }

    // Hide loading and show content
    hideCardsLoading(listEl);

    // Replace static content with enhanced dynamic content
    listEl.innerHTML = '';
    listEl.setAttribute('role', 'list');
    cards.forEach((card, index) => {
      const cardElement = renderCard(card);
      // Staggered animation
      setTimeout(() => {
        cardElement.classList.add('fade-in');
      }, index * 150);
      listEl.appendChild(cardElement);
    });

    // Add click listener
    root.addEventListener('click', (ev) => {
      const anchor = (ev.target as HTMLElement).closest('a') as HTMLAnchorElement;

      if (anchor && root.contains(anchor)) {
        ev.preventDefault();
        analytics.logLinkClick(anchor);
      }
    });
  } catch (error) {
    hideCardsLoading(listEl);
    showCardsError(listEl, 'Failed to load cards content');
    // eslint-disable-next-line no-console
    console.error('Cards loading error:', error);
  }
}

function showCardsLoading(listEl: HTMLUListElement): void {
  listEl.innerHTML = `
    <li class="card skeleton">
      <div class="skeleton skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-caption">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
    </li>
    <li class="card skeleton">
      <div class="skeleton skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-caption">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
    </li>
    <li class="card skeleton">
      <div class="skeleton skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-caption">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
    </li>
  `;
}

function hideCardsLoading(listEl: HTMLUListElement): void {
  const skeletonCards = listEl.querySelectorAll('.card.skeleton');
  skeletonCards.forEach((card) => card.remove());
}

function showCardsError(listEl: HTMLUListElement, message: string): void {
  listEl.innerHTML = `
    <div class="loading">
      <div style="text-align: center; color: var(--color-accent);">
        <p>${message}</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--color-accent); color: white; border: none; border-radius: var(--radius); cursor: pointer;">
          Try Again
        </button>
      </div>
    </div>
  `;
}
