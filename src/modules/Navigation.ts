export class Navigation {
  private navbar: HTMLElement;
  private links: NodeListOf<HTMLAnchorElement>;

  constructor() {
    this.navbar = document.querySelector('.navbar') as HTMLElement;
    this.links = document.querySelectorAll('.navbar__link');

    if (this.navbar && this.links.length > 0) {
      this.init();
    }
  }

  private init(): void {
    this.setupSmoothScroll();
    this.setupActiveStates();
  }

  private setupSmoothScroll(): void {
    this.links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href');
        if (!targetId) return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const navbarHeight = this.navbar.offsetHeight;
        const targetPosition = (targetElement as HTMLElement).offsetTop - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        this.updateActiveLink(targetId);
      });
    });
  }

  private setupActiveStates(): void {
    this.updateActiveStatesOnScroll();

    window.addEventListener('scroll', () => {
      this.updateActiveStatesOnScroll();
    });
  }

  private updateActiveStatesOnScroll(): void {
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = this.navbar.offsetHeight;
    const scrollPos = window.scrollY + navbarHeight + 100;

    let activeSection = '';

    sections.forEach((section) => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = (section as HTMLElement).offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        activeSection = `#${section.id}`;
      }
    });

    if (activeSection) {
      this.updateActiveLink(activeSection);
    }
  }

  private updateActiveLink(targetId: string): void {
    this.links.forEach((link) => {
      link.classList.remove('navbar__link--active');
    });

    const activeLink = document.querySelector(`[href="${targetId}"]`);
    if (activeLink) {
      activeLink.classList.add('navbar__link--active');
    }
  }
}
