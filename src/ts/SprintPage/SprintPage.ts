import { IPage } from '../common/IPage';
import Menu from '../common/Menu';
import { PageContext, WordContent } from '../common/types';

import { baseUrl } from '../common/constants';

import SprintGameView from './sView';

export default class SprintPage extends IPage {
  context: PageContext;

  private selectedLevel = '1';

  constructor(ctx: PageContext) {
    super();
    this.context = ctx;

    // attach handler for level selection
    const levelSelectorBlocks = document.querySelectorAll(
      '#lev-1, #lev-2, #lev-3, #lev-4, #lev-5, #lev-6',
    );
    levelSelectorBlocks.forEach((item) => {
      item.addEventListener('click', (evt: Event) => {
        this.sprintGameSelectHandler(evt);
      });
    });

    // attach handlers for game start

    const startSprintGameButton = document.querySelector('.play-game-btn');
    startSprintGameButton.addEventListener('click', (evt: Event) =>
      this.sprintGameStartingHandler(evt),
    );
  }

  sprintGameSelectHandler(event: Event) {
    // console.log(event.currentTarget);
    const levelSelectors = document.querySelectorAll(
      '#lev-1, #lev-2, #lev-3, #lev-4, #lev-5, #lev-6',
    );

    // reset selected btn
    levelSelectors.forEach((item) => {
      item.classList.remove('level-chosen');
    });

    (event.target as HTMLElement).classList.toggle('level-chosen');

    this.selectedLevel = (event.target as HTMLElement).textContent.toString();
    console.log(this.selectedLevel, 'selected level');
  }

  async sprintGameStartingHandler(event: Event) {
    // async call here

    const resp: Array<WordContent> = await fetch(
      `${baseUrl}words?group=${this.selectedLevel}&page=${1}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => response.json())
      .catch((err) => {
        throw new Error(err);
      });

    console.log(resp, '>>>');

    const sprintComponent = document.querySelector('.start-game');
    sprintComponent.replaceChildren(new SprintGameView(resp).domNode);
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
