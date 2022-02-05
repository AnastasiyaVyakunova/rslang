import { PageContext } from './types';

export default abstract class IPage {
  abstract context: PageContext;
  abstract render(): void;
  abstract setHandler(): void;
}
