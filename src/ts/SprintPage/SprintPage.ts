import { IPage } from '../common/IPage';
import Menu from '../common/Menu';
import { PageContext } from '../common/types';

// import domFactory from './domFactory';
// import './sprint.css';
import SprintGameView from './sView';

export default class SprintPage extends IPage {
  context: PageContext;

  constructor(ctx: PageContext) {
    super();
    this.context = ctx;

    // working block
    let sprintComponent = document.querySelector('.start-game');
    sprintComponent.replaceChildren(new SprintGameView().domNode);
    // sprintComponent = new SprintGameView();
  }

  render(): Promise<boolean> {
    Menu.render(this.context);
    // console.log(this.context.pageName);
    return Promise.resolve(true);
  }

  setHandler(): void {
    Menu.setHandler(this.context);
    // console.log(this.context.pageName);
  }
}
