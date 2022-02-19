import { IPage } from '../common/IPage';
import Menu from '../common/Menu';
import { PageContext } from '../common/types';

export default class AudiocallPage extends IPage {
  context: PageContext;

  constructor(ctx: PageContext) {
    super();
    this.context = ctx;
  }

  render(): Promise<boolean> {
    Menu.render(this.context);
    console.log(this.context.pageName);
    return Promise.resolve(true);
  }

  setHandler(): void {
    Menu.setHandler(this.context);
    console.log(this.context.pageName);
  }
}
