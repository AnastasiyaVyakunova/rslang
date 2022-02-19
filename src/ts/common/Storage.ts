import { PageContext } from './types';

export default class Storage {
  static store(ctx: PageContext) {
    console.log(ctx);
    localStorage.setItem('user.username', ctx.user.userName);
    localStorage.setItem('user.token', ctx.user.token);
    localStorage.setItem('user.useremail', ctx.user.userEmail);
    localStorage.setItem('user.tokenrefresh', ctx.user.tokenRefresh);
    localStorage.setItem('user.id', ctx.user.id);

    localStorage.setItem('book.pageId', ctx.book.pageId.toString());
    localStorage.setItem('book.groupId', ctx.book.groupId.toString());
  }

  static load(ctx: PageContext) {
    if (localStorage.length !== 0) {
      ctx.user.userName = localStorage.getItem('user.username');
      ctx.user.token = localStorage.getItem('user.token');
      ctx.user.userEmail = localStorage.getItem('user.useremail');
      ctx.user.tokenRefresh = localStorage.getItem('user.tokenrefresh');
      ctx.user.id = localStorage.getItem('user.id');

      ctx.book.pageId = Number(localStorage.getItem('book.pageId'));
      ctx.book.groupId = Number(localStorage.getItem('book.groupId'));
    }
  }
}
