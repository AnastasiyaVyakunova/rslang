import Game from './Game';

import IPageGame from '../common/IPageGame';
import IAuthComponent from '../common/IAuthComponent';

export default class AudiocallPage extends IPageGame {
  game:IAuthComponent = new Game();
}
