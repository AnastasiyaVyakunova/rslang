import { PageName } from './common/constants';
import { PageContext, resetAuthContext } from './common/types';
import { IPage, PageConstructor } from './common/IPage';
import Storage from './common/Storage';

function createContext(): PageContext {
  return {
    pageName: PageName.undefined,
    user: resetAuthContext(),
    book: {
      pageId: 0, groupId: 0,
    },
  };
}

export default class PageLoader {
  private static context: PageContext = createContext();

  private static page: IPage;

  private static initContext(name: PageName) {
    // this function will be read user login and user token from storage
    PageLoader.context.pageName = name;
    Storage.load(PageLoader.context);
  }

  static create(Fabric: PageConstructor, name: PageName) {
    this.initContext(name);
    this.page = new Fabric(this.context);
    this.page.render()
      .then(() => this.page.setHandler());
  }

  static exit() {
    Storage.store(PageLoader.context);
  }
}
