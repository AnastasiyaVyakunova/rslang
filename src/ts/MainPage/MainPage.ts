import IPage from '../common/IPage';
import { PageContext } from '../common/types';

export default class MainPage extends IPage {
  context: PageContext;

  constructor(ctx: PageContext) {
    super();
    this.context = ctx;
  }

  render(): void {
    console.log(this.context.pageName);
  }

  setHandler(): void {
    console.log(this.context.pageName);
  }
}
