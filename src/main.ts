import './styles/main.scss';
import Gallery from './modules/Gallery';
import { initCards } from './modules/Cards';
import { Navigation } from './modules/Navigation';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Navigation
  new Navigation();

  // Initialize Gallery
  document.querySelectorAll<HTMLElement>('[data-module="gallery"]').forEach(async (el) => {
    const mod = new Gallery(el);
    await mod.init();
  });

  // Initialize Cards
  initCards();
});
