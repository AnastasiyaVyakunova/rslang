import '../style.css';
import PageLoader from './PageLoader';
import MainPage from './MainPage/MainPage';
import { PageName } from './common/constants';
import SprintPage from './SprintPage/SprintPage';
import AudiocallPage from './AudiocallPage/AudiocallPage';

export function makeMainPage() {
  const loader = new PageLoader(MainPage, PageName.main);
  return loader;
}

export function makeSprintPage() {
  const loader = new PageLoader(SprintPage, PageName.sprint);
  return loader;
}

export function makeAudiocallPage() {
  const loader = new PageLoader(AudiocallPage, PageName.audiocall);
  return loader;
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
    default:
      console.log('unkown page:', header.id);
      break;
  }
};
