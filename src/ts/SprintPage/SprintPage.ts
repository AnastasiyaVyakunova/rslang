// import { IPage } from '../common/IPage';
// import Menu from '../common/Menu';
// import { PageContext } from '../common/types';

// export default class SprintPage extends IPage {
//   context: PageContext;

//   constructor(ctx: PageContext) {
//     super();
//     this.context = ctx;
//   }

//   render(): Promise<boolean> {
//     Menu.render(this.context);
//     return Promise.resolve(true);
//   }

//   setHandler(): void {
//     Menu.setHandler(this.context);
//   }
// }

import IPageGame from '../common/IPageGame';
import IAuthComponent from '../common/IAuthComponent';
import Game from './Game';

export default class SprintPage extends IPageGame {
  game:IAuthComponent = new Game();
}
