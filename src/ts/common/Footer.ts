import { addFragment } from './utils';
import footer from '../../html/templates/footer.template.html';

export default class Footer {
  static setHandler() {

  }

  static render() {
    const ftr = document.querySelector('footer');
    addFragment(ftr, '#footer', footer);
  }
}
