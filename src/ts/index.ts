import PageLoader from './PageLoader';
import MainPage from './MainPage/MainPage';
import { PageName } from './common/constants';
import SprintPage from './SprintPage/SprintPage';

export function makeMainPage() {
  const loader = new PageLoader(MainPage, PageName.main);
  return loader;
}

export function makeSprintPage() {
  const loader = new PageLoader(SprintPage, PageName.sprint);
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
    default:
      console.log('unkown page:', header.id);
      break;
  }
};
