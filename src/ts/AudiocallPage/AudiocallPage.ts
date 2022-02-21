import { maxNumTextBookSubPage } from '../common/constants';
import { IPage } from '../common/IPage';
import Menu from '../common/Menu';
import { AudiocallContent, PageContext, resetTextBookContext, TextBookContext } from '../common/types';
import Game from './Game';

export default class AudiocallPage extends IPage {
  context: PageContext;

  book: TextBookContext = resetTextBookContext();

  game: Game = new Game();

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

      const content: AudiocallContent = {
        book: this.book, replacement: selector, parent: parentNode,
      };
      this.game.render(content);
      this.game.authRender(this.context.user);
    };
  }
}
