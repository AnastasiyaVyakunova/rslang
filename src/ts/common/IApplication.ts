import { IPage } from './IPage';

export default abstract class IApplication extends IPage {
  abstract redraw(): void;
  abstract clear(): Promise<boolean>;
}
