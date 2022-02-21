import IPageGame from '../common/IPageGame';
import IAuthComponent from '../common/IAuthComponent';
import Game from './Game';

export default class SprintPage extends IPageGame {
  game:IAuthComponent = new Game();
}
