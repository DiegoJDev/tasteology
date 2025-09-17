export interface LinkClickEvent {
  cardId: string;
  linkType: string;
  destination: string;
  href: string;
  label: string;
  target?: string;
  timestamp: string;
  element: HTMLAnchorElement;
}

export class AnalyticsService {
  private events: LinkClickEvent[] = [];

  logLinkClick(anchor: HTMLAnchorElement): void {
    const event: LinkClickEvent = {
      cardId: anchor.getAttribute('data-card-id') || 'unknown',
      linkType: anchor.getAttribute('data-link-type') || 'generic',
      destination: anchor.getAttribute('data-link-destination') || anchor.href,
      href: anchor.href,
      label: anchor.getAttribute('aria-label') || anchor.textContent?.trim() || '',
      target: anchor.target || '_self',
      timestamp: new Date().toISOString(),
      element: anchor,
    };

    this.events.push(event);

    console.group('Card Link Click Event');
    console.log('Event Details:', {
      cardId: event.cardId,
      linkType: event.linkType,
      destination: event.destination,
      timestamp: event.timestamp,
    });
    console.log('Full Anchor Element:', anchor);
    console.log('Event Object:', event);
    console.groupEnd();

    this.sendToAnalytics(event);
  }

  getEvents(): LinkClickEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }

  private sendToAnalytics(event: LinkClickEvent): void {
    // You can implement this method to send the event to your analytics service, i.e: Google Analytics, Hotjar, etc.,

    console.log('Analytics Event Sent:', {
      service: 'placeholder',
      eventId: `card-click-${Date.now()}`,
      data: event,
    });
  }
}

export const analytics = new AnalyticsService();
