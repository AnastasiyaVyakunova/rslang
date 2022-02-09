import { PageName } from './common/constants';
import { PageContext } from './common/types';
import { IPage, PageConstructor } from './common/IPage';

import '../style.css';

export default class PageLoader {
  private context: PageContext = { pageName: PageName.undefined, username: '', token: '' };

  private page: IPage;

  private initContext(name: PageName) {
    // this function will be read user login and user token from storage
    this.context.pageName = name;
  }

  constructor(Fabric: PageConstructor, name: PageName) {
    this.initContext(name);
    this.page = new Fabric(this.context);
    this.page.render();
    this.page.setHandler();
  }
}
