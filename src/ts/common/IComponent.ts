import { Content } from './types';

export default abstract class IComponent {
  abstract render(data: Content): void;
  abstract setHandler(): void;
}
