import { PageContext } from './types';

export default class Storage {
  static store(ctx: PageContext) {
    console.log(ctx);
    localStorage.setItem('user.username', ctx.user.username);
    localStorage.setItem('user.token', ctx.user.token);
    localStorage.setItem('book.pageId', ctx.book.pageId.toString());
    localStorage.setItem('book.groupId', ctx.book.groupId.toString());
  }

  static load(ctx: PageContext) {
    if (localStorage.length !== 0) {
      ctx.user.username = localStorage.getItem('user.username');
      ctx.user.token = localStorage.getItem('user.token');
      ctx.book.pageId = Number(localStorage.getItem('book.pageId'));
      ctx.book.groupId = Number(localStorage.getItem('book.groupId'));
    }
  }
}
