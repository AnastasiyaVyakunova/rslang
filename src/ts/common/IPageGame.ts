import { maxNumTextBookSubPage } from './constants';
import IAuthComponent from './IAuthComponent';
import { IPage } from './IPage';
import Menu from './Menu';
import {
  GameContent, PageContext, resetTextBookContext, TextBookContext,
} from './types';

export default abstract class IPageGame extends IPage {
  context: PageContext;

  book: TextBookContext = resetTextBookContext();

  abstract game: IAuthComponent;

  constructor(ctx: PageContext) {
    super();
    this.context = ctx;
  }

  render(): Promise<boolean> {
    Menu.render(this.context);

    if (window.location.search !== '') {
      const params = new URLSearchParams(window.location.search);
      this.book.groupId = Number(params.get('groupId'));
      this.book.pageId = Number(params.get('pageId'));
      document.querySelector<HTMLElement>('.choose-level').style.display = 'none';
    } else {
      this.book.pageId = Math.round(Math.random() * (maxNumTextBookSubPage - 1));
    }

    return Promise.resolve(true);
  }

  setHandler(): void {
    Menu.setHandler(this.context);
    this.game.setHandler();
    this.game.setAuthHandler(this.context.user);
    const level = document.querySelector<HTMLElement>('.choose-level');
    level.onclick = (event) => {
      this.book.groupId = Number((event.target as Element).id);
      document.querySelector<HTMLElement>('.level-chosen').classList.remove('level-chosen');
      (event.target as Element).classList.add('level-chosen');
    };

    const starter = document.querySelector<HTMLElement>('.play-game-btn');
    starter.onclick = () => {
      const parentNode = document.querySelector<HTMLElement>('body');
      const selector = parentNode.querySelector<HTMLElement>('.start-game');

      const content: GameContent = {
        book: this.book, replacement: selector, parent: parentNode,
      };
      this.game.render(content);
      this.game.authRender(this.context.user);
    };
  }
}
