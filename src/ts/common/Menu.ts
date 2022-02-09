import { addFragment } from './utils';
import menu from '../../html/templates/menu.template.html';

export default class Menu {
  static setHandler() {

  }

  static render() {
    const header = document.querySelector('header');
    addFragment(header, '#menu', menu);
  }
}
