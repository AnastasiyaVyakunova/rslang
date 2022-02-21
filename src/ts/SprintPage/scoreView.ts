import domFactory from './domFactory';

import { GameAnswer } from '../common/types';

export default class ScoreView {
  domNode: HTMLElement;

  constructor(recivedGameAnswers: Array<GameAnswer>) {
    // this.domNode.innerHTML = JSON.stringify(recivedGameAnswers, null, 2);
    console.log(recivedGameAnswers);
  }
}
