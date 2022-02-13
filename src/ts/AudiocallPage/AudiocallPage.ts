import { IPage } from '../common/IPage';
import Menu from '../common/Menu';
import { PageContext } from '../common/types';

export default class AudiocallPage extends IPage {
  context: PageContext;

  constructor(ctx: PageContext) {
    super();
    this.context = ctx;
  }

  render(): void {
    Menu.render();
    console.log(this.context.pageName);
  }

  setHandler(): void {
    console.log(this.context.pageName);
  }
}
