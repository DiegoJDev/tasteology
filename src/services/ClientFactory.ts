import type { ContentGateway } from './ContentGateway';
import { JsonContentGateway } from './JsonClient';

export type ClientKind = 'json' | 'rest' | 'graphql';

export function createContentGateway(kind: ClientKind = 'json'): ContentGateway {
  switch (kind) {
    case 'json':
    default:
      return new JsonContentGateway('/data');
  }
}
