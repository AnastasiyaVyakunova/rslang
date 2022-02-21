import IComponent from './IComponent';
import { AuthContext } from './types';

export default abstract class IAuthComponent extends IComponent {
  abstract authRender(auth: AuthContext): void;
  abstract setAuthHandler(auth: AuthContext): void;
}
