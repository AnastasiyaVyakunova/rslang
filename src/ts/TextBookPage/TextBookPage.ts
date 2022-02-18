import { baseUrl, maxNumTextBookSubPage, numSubPageButton } from '../common/constants';
import Footer from '../common/Footer';
import IApplication from '../common/IApplication';
import Menu from '../common/Menu';
import { PageContext } from '../common/types';
import Card from './Card';
import pagination from '../../html/templates/pagination.template.html';
import levelsTemplate from '../../html/templates/levels.template.html';
import { addFragment } from '../common/utils';

export default class TextBookPage extends IApplication {
  context: PageContext;

  cards: Card[];

  constructor(ctx: PageContext) {
    super();
    this.context = ctx;
    this.cards = [];
  }

  renderCards(): Promise<boolean> {
    const { pageId, groupId } = this.context.book;
    return fetch(`${baseUrl}words?group=${groupId}&page=${pageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json(), () => Promise.reject(Error))
      .then((data) => {
        for (let i = 0; i < data.length; i += 1) {
          this.cards.push(new Card());
          this.cards[this.cards.length - 1].render(data[i]);
        }
        return Promise.resolve(true);
      }, () => Promise.reject(Error));
  }

  renderPagination() {
    const { pageId, groupId } = this.context.book;

    const levelsWrapper = document.querySelector('.levels_wrapper');
    addFragment(levelsWrapper, '#pagination', levelsTemplate);
    const levels = levelsWrapper.querySelectorAll('.level');
    (levels[groupId] as HTMLElement).classList.add('active');

    const paginationWrapper = document.querySelector('.pagination_wrapper');
    addFragment(paginationWrapper, '#pagination', pagination);
    const pageButtons = paginationWrapper.querySelectorAll('.page-button') as NodeListOf<HTMLButtonElement>;
    if ((pageId + 1) >= numSubPageButton && pageId <= (maxNumTextBookSubPage - numSubPageButton)) {
      pageButtons[3].textContent = (pageId + 1).toString();
      pageButtons[2].textContent = (pageId).toString();
      pageButtons[4].textContent = (pageId + 2).toString();
      pageButtons[3].id = (pageId).toString();
      pageButtons[2].id = (pageId - 1).toString();
      pageButtons[4].id = (pageId + 1).toString();
      pageButtons[3].classList.add('active');
      pageButtons[1].textContent = '...';
      pageButtons[5].textContent = '...';
      pageButtons[1].classList.add('more');
      pageButtons[5].classList.add('more');
      pageButtons[1].disabled = true;
      pageButtons[5].disabled = true;
    } else if (pageId < numSubPageButton) {
      pageButtons[3].textContent = '4';
      pageButtons[2].textContent = '3';
      pageButtons[4].textContent = '5';
      pageButtons[1].textContent = '2';
      pageButtons[3].id = '3';
      pageButtons[2].id = '2';
      pageButtons[4].id = '4';
      pageButtons[1].id = '1';
      pageButtons[5].textContent = '...';
      pageButtons[5].classList.add('more');
      pageButtons[5].disabled = true;
      pageButtons[pageId].classList.add('active');
    } else {
      pageButtons[3].textContent = '27';
      pageButtons[2].textContent = '26';
      pageButtons[4].textContent = '28';
      pageButtons[1].textContent = '...';
      pageButtons[5].textContent = '29';
      pageButtons[3].id = '26';
      pageButtons[2].id = '25';
      pageButtons[4].id = '27';
      pageButtons[5].id = '28';
      pageButtons[1].classList.add('more');
      pageButtons[1].disabled = true;
      pageButtons[1 + numSubPageButton - (maxNumTextBookSubPage - 1 - pageId)].classList.add('active');
    }
  }

  render(): Promise<boolean> {
    Menu.render();
    Footer.render();
    this.renderPagination();
    return this.renderCards();
  }

  setHandlerCards(): void {
    for (let i = 0; i < this.cards.length; i += 1) {
      this.cards[i].setHandler();
    }
  }

  setHandlerPagination(): void {
    const levelsWrapper: HTMLElement = document.querySelector('.levels_wrapper');
    levelsWrapper.onclick = (event) => {
      const group: Element = event.target as Element;
      switch (group.id) {
        case 'groupId1':
          this.context.book.groupId = 0;
          this.context.book.pageId = 0;
          break;
        case 'groupId2':
          this.context.book.groupId = 1;
          this.context.book.pageId = 0;
          break;
        case 'groupId3':
          this.context.book.groupId = 2;
          this.context.book.pageId = 0;
          break;
        case 'groupId4':
          this.context.book.groupId = 3;
          this.context.book.pageId = 0;
          break;
        case 'groupId5':
          this.context.book.groupId = 4;
          this.context.book.pageId = 0;
          break;
        case 'groupId6':
          this.context.book.groupId = 5;
          this.context.book.pageId = 0;
          break;
        default: break;
      }
      this.redraw();
    };
    const paginationWrapper: HTMLElement = document.querySelector('.pagination');
    paginationWrapper.onclick = (event) => {
      const page: Element = event.target as Element;
      switch (page.id) {
        case 'left':
          this.context.book.pageId -= 1;
          if (this.context.book.pageId < 0) {
            this.context.book.pageId = 0;
          }
          break;
        case 'right':
          this.context.book.pageId += 1;
          if (this.context.book.pageId >= maxNumTextBookSubPage) {
            this.context.book.pageId = maxNumTextBookSubPage - 1;
          }
          break;
        default:
          this.context.book.pageId = Number(page.id);
          break;
      }
      this.redraw();
    };
  }

  setHandler(): void {
    this.setHandlerCards();
    this.setHandlerPagination();
    Menu.setHandler(this.context);
  }

  redraw(): void {
    this.clear()
      .then(() => this.renderCards())
      .then(() => this.setHandlerCards());
    this.renderPagination();
    this.setHandlerPagination();
  }

  clear(): Promise<boolean> {
    for (let i = 0; i < this.cards.length; i += 1) {
      delete this.cards[i];
    }
    this.cards = [];
    const cardWrapper = document.querySelector('#cardsWrapper');
    const paginationWrapper = document.querySelector('.pagination_wrapper');
    const levelsWrapper = document.querySelector('.levels_wrapper');
    cardWrapper.innerHTML = '';
    paginationWrapper.innerHTML = '';
    levelsWrapper.innerHTML = '';
    return Promise.resolve(true);
  }
}
