import { PageContext } from './types';

export abstract class IPage {
  abstract context: PageContext;
  abstract render(): Promise<boolean>;
  abstract setHandler(): void;
}

export interface PageConstructor {
  new (ctx: PageContext): IPage;
}
