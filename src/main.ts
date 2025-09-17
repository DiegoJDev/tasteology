import './styles/main.scss';
import Gallery from './modules/Gallery';
import { initCards } from './modules/Cards';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll<HTMLElement>('[data-module="gallery"]').forEach(async (el) => {
    const mod = new Gallery(el);
    await mod.init();
  });

  initCards();
});
