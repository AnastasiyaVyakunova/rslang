import { PageName } from './common/constants';
import { PageContext } from './common/types';
import IPage from './common/IPage';
import MainPage from './MainPage/MainPage';
import '../style.css';

export default class PageLoader {
  private context : PageContext;

  private page : IPage;

  private initContext(name: PageName) {
    // this function will be read user login and user token from storage
    this.context.pageName = name;
  }

  constructor(name: PageName) {
    this.initContext(name);
    switch (name) {
      case PageName.main:
        this.page = new MainPage(this.context);
        break;
      default:
        console.log('Not implemented');
        break;
    }
    this.page.render();
    this.page.setHandler();
  }
}
// export const loader = new PageLoader();
