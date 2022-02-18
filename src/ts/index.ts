import '../style.css';
import PageLoader from './PageLoader';
import MainPage from './MainPage/MainPage';
import { PageName } from './common/constants';
import SprintPage from './SprintPage/SprintPage';
import AudiocallPage from './AudiocallPage/AudiocallPage';
import TextBookPage from './TextBookPage/TextBookPage';

export function makeMainPage() {
  PageLoader.create(MainPage, PageName.main);
}

export function makeSprintPage() {
  PageLoader.create(SprintPage, PageName.sprint);
}

export function makeAudiocallPage() {
  PageLoader.create(AudiocallPage, PageName.audiocall);
}

export function makeTextBookPage() {
  PageLoader.create(TextBookPage, PageName.textbook);
}

window.onload = function () {
  const header = document.querySelector('header');
  switch (header.id) {
    case 'main':
      makeMainPage();
      break;
    case 'sprint':
      makeSprintPage();
      break;
    case 'audiocall':
      makeAudiocallPage();
      break;
    case 'textbook':
      makeTextBookPage();
      break;
    default:
      console.log('unkown page:', header.id);
      break;
  }
};
