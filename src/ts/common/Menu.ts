import { addFragment } from './utils';
import menu from '../../html/templates/menu.template.html';
import PageLoader from '../PageLoader';
import { PageContext } from './types';

export default class Menu {
  static ulHandler(ctx: PageContext, header: HTMLElement) {
    const ul: HTMLUListElement = header.querySelector('.navigation');
    ul.onclick = (event) => {
      const a: Element = event.target as Element;
      switch (a.id) {
        case 'groupId1':
          ctx.book.groupId = 0;
          ctx.book.pageId = 0;
          break;
        case 'groupId2':
          ctx.book.groupId = 1;
          ctx.book.pageId = 0;
          break;
        case 'groupId3':
          ctx.book.groupId = 2;
          ctx.book.pageId = 0;
          break;
        case 'groupId4':
          ctx.book.groupId = 3;
          ctx.book.pageId = 0;
          break;
        case 'groupId5':
          ctx.book.groupId = 4;
          ctx.book.pageId = 0;
          break;
        case 'groupId6':
          ctx.book.groupId = 5;
          ctx.book.pageId = 0;
          break;
        default: break;
      }
      PageLoader.exit();
    };
  }

  static setHandler(ctx: PageContext) {
    const header = document.querySelector('header');
    Menu.ulHandler(ctx, header);
  }

  static render() {
    const header = document.querySelector('header');
    addFragment(header, '#menu', menu);
  }
}
