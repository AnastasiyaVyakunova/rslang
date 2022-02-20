import { addFragment } from './utils';
import menu from '../../html/templates/menu.template.html';
import PageLoader from '../PageLoader';
import {
  PageContext, SigninContext, SignupContext, resetAuthContext,
} from './types';
import { baseUrl } from './constants';

export default class Menu {
  static ulHandler(ctx: PageContext, header: HTMLElement) {
    const ul: HTMLUListElement = header.querySelector('.navigation');
    ul.onclick = (event) => {
      const a: Element = event.target as Element;
      switch (a.id) {
        case 'groupId1':
          ctx.book.groupId = 0;
          ctx.book.pageId = 0;
          break;
        case 'groupId2':
          ctx.book.groupId = 1;
          ctx.book.pageId = 0;
          break;
        case 'groupId3':
          ctx.book.groupId = 2;
          ctx.book.pageId = 0;
          break;
        case 'groupId4':
          ctx.book.groupId = 3;
          ctx.book.pageId = 0;
          break;
        case 'groupId5':
          ctx.book.groupId = 4;
          ctx.book.pageId = 0;
          break;
        case 'groupId6':
          ctx.book.groupId = 5;
          ctx.book.pageId = 0;
          break;
        case 'groupId7':
          ctx.book.groupId = -1;
          ctx.book.pageId = 0;
          break;
        default: break;
      }
      PageLoader.exit();
    };
  }

  static authFormHandler(ctx: PageContext, header: HTMLElement) {
    const overlay: HTMLElement = header.querySelector('.overlay');
    const open: HTMLButtonElement = document.querySelector('.login');
    const exit: HTMLButtonElement = overlay.querySelector('.form_exit');
    const logout: HTMLButtonElement = header.querySelector('.logout');

    const registration: HTMLButtonElement = overlay.querySelector('.reg');
    const auth: HTMLButtonElement = overlay.querySelector('.auth');
    const form: HTMLFormElement = overlay.querySelector('.form-style');
    const loginButton: HTMLButtonElement = overlay.querySelector('.form_button');

    open.onclick = () => {
      overlay.style.display = 'flex';
    };
    exit.onclick = () => {
      overlay.style.display = 'none';
    };
    logout.onclick = () => {
      ctx.user = resetAuthContext();
      const login: HTMLElement = header.querySelector('.login');
      const userNameText: HTMLElement = header.querySelector('.user-name');
      login.hidden = false;
      logout.hidden = true;
      userNameText.hidden = true;
      userNameText.textContent = '';
      window.location.href = `${window.location.origin}/`;
    };

    const email: HTMLInputElement = overlay.querySelector('.form_email');
    const password: HTMLInputElement = overlay.querySelector('.form_pswrd');
    const line: HTMLSpanElement = overlay.querySelector('.line-email');
    const linePswrd: HTMLSpanElement = overlay.querySelector('.line-pswrd');

    email.onblur = () => {
      if (email.value !== '') {
        email.required = true;
        const regex = /\S+@\S+\.\S+/;
        if (!regex.test(email.value)) {
          line.classList.add('wrong');
        } else {
          line.classList.remove('wrong');
        }
      } else {
        email.required = false;
      }
    };

    password.onblur = () => {
      if (password.value !== '') {
        password.required = true;
      } else {
        password.required = false;
      }
    };

    password.oninput = () => {
      if (password.value.length < 8) {
        linePswrd.classList.add('wrong');
      } else {
        linePswrd.classList.remove('wrong');
      }
    };

    auth.onclick = () => {
      registration.classList.remove('select');
      auth.classList.add('select');

      form.querySelector<HTMLElement>('#label0').hidden = true;
      form.querySelector<HTMLElement>('#label3').hidden = true;

      loginButton.classList.remove('reg-btn');
      loginButton.classList.add('login-btn');
      loginButton.textContent = 'Войти';
    };
  }

  static regFormHandler(ctx: PageContext, header: HTMLElement) {
    const overlay: HTMLElement = header.querySelector('.overlay');
    const registration: HTMLButtonElement = overlay.querySelector('.reg');
    const auth: HTMLButtonElement = overlay.querySelector('.auth');
    const regButton: HTMLButtonElement = overlay.querySelector('.form_button');
    const form: HTMLFormElement = overlay.querySelector('.form-style');

    registration.onclick = () => {
      auth.classList.remove('select');
      registration.classList.add('select');

      regButton.classList.remove('login-btn');
      regButton.classList.add('reg-btn');
      regButton.textContent = 'Зарегистрироваться';
      form.querySelector<HTMLElement>('#label0').hidden = false;
      form.querySelector<HTMLElement>('#label3').hidden = false;
    };

    const pswrd: HTMLInputElement = overlay.querySelector('.form_pswrd');
    const name: HTMLInputElement = overlay.querySelector('.form_name');
    const approve: HTMLInputElement = overlay.querySelector('.form_approve');
    const spanApprove: HTMLSpanElement = overlay.querySelector('.line-approve');

    approve.oninput = () => {
      if (pswrd.value !== approve.value) {
        spanApprove.classList.add('wrong');
      } else {
        spanApprove.classList.remove('wrong');
      }
    };

    approve.onblur = () => {
      if (approve.value !== '') {
        approve.required = true;
      } else {
        approve.required = false;
      }
    };

    name.onblur = () => {
      if (name.value !== '') {
        name.required = true;
      } else {
        name.required = false;
      }
    };
  }

  private static signin(signin: SigninContext, ctx: PageContext): Promise<boolean> {
    return fetch(`${baseUrl}signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signin),
    }).then((response) => response.json(), () => Promise.reject(Error))
      .then((data) => {
        ctx.user.userEmail = data.user.email;
        ctx.user.id = data.user.id;
        ctx.user.token = data.token;
        ctx.user.tokenRefresh = data.refreshToken;
        return fetch(`${baseUrl}users/${ctx.user.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ctx.user.token}`,
            'Accept': 'application/json',
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not OK');
          }
          return response.json();
        }, () => Promise.reject(Error))
          .catch((response) => Promise.reject(response))
          .then((dataUser) => {
            ctx.user.userName = dataUser.name;
            return Promise.resolve(true);
          }, () => Promise.reject(Error));
      }, () => Promise.reject(Error));
  }

  private static signup(signup: SigninContext): Promise<boolean> {
    return fetch(`${baseUrl}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signup),
    }).then((response) => response.json(), () => Promise.reject(Error))
      .then(() => Promise.resolve(true), () => Promise.reject(Error));
  }

  static serverHandler(ctx: PageContext, header: HTMLElement) {
    const overlay: HTMLElement = header.querySelector('.overlay');
    const regButton: HTMLButtonElement = overlay.querySelector('.form_button');
    const email: HTMLInputElement = overlay.querySelector('.form_email');
    const lineEmail: HTMLSpanElement = overlay.querySelector('.line-email');
    const password: HTMLInputElement = overlay.querySelector('.form_pswrd');
    const linePswrd: HTMLSpanElement = overlay.querySelector('.line-pswrd');
    const name: HTMLInputElement = overlay.querySelector('.form_name');
    const lineName: HTMLSpanElement = overlay.querySelector('.line-name');
    const pswrdApprove: HTMLInputElement = overlay.querySelector('.form_approve');

    regButton.onclick = () => {
      if (regButton.classList.contains('login-btn')) {
        // login
        const emailString = email.value;
        const pswrdString = password.value;

        const errorHappens = () => {
          lineEmail.classList.add('wrong');
          linePswrd.classList.add('wrong');
          email.required = true;
          password.required = true;
          ctx.user = resetAuthContext();
        };

        if (!(lineEmail.classList.contains('wrong') || linePswrd.classList.contains('wrong'))
        && (emailString !== '' && pswrdString !== '')) {
          const dataPost: SigninContext = { email: emailString, password: pswrdString };
          Menu.signin(dataPost, ctx).then(() => {
            overlay.style.display = 'none';
            PageLoader.exit();
            const login: HTMLElement = header.querySelector('.login');
            const logout: HTMLElement = header.querySelector('.logout');
            const userNameText: HTMLElement = header.querySelector('.user-name');
            login.hidden = true;
            logout.hidden = false;
            userNameText.hidden = false;
            userNameText.textContent = ctx.user.userName;
            window.location.href = `${window.location.origin}/`;
          }, () => errorHappens());
        } else {
          errorHappens();
        }
      } else {
        // registration
        const registration: HTMLButtonElement = overlay.querySelector('.reg');
        const auth: HTMLButtonElement = overlay.querySelector('.auth');
        const form: HTMLFormElement = overlay.querySelector('.form-style');
        const emailString = email.value;
        const pswrdString = password.value;
        const nameString = name.value;
        const approveString = pswrdApprove.value;

        const errorHappens = () => {
          lineEmail.classList.add('wrong');
          linePswrd.classList.add('wrong');
          lineName.classList.add('wrong');
          name.required = true;
          email.required = true;
          password.required = true;
          ctx.user = resetAuthContext();
        };

        if (!(lineEmail.classList.contains('wrong') || linePswrd.classList.contains('wrong') || lineName.classList.contains('wrong'))
        && (emailString !== '' && pswrdString !== '' && nameString !== '' && pswrdString === approveString)) {
          const dataPost: SignupContext = {
            name: nameString,
            email: emailString,
            password: pswrdString,
          };
          Menu.signup(dataPost).then(() => {
            registration.classList.remove('select');
            auth.classList.add('select');
            form.querySelector<HTMLElement>('#label0').hidden = true;
            form.querySelector<HTMLElement>('#label3').hidden = true;
            regButton.classList.remove('reg-btn');
            regButton.classList.add('login-btn');
            regButton.textContent = 'Войти';
          }, () => errorHappens());
        } else {
          errorHappens();
        }
      }
    };
  }

  static setHandler(ctx: PageContext) {
    const header = document.querySelector('header');
    Menu.ulHandler(ctx, header);
    Menu.authFormHandler(ctx, header);
    Menu.regFormHandler(ctx, header);
    Menu.serverHandler(ctx, header);
  }

  static render(ctx: PageContext) {
    const header = document.querySelector('header');
    addFragment(header, '#menu', menu);
    if (ctx.user.userName !== '') {
      const login: HTMLElement = header.querySelector('.login');
      const logout: HTMLElement = header.querySelector('.logout');
      const userNameText: HTMLElement = header.querySelector('.user-name');
      const dWords: HTMLElement = header.querySelector('.d-words');
      login.hidden = true;
      logout.hidden = false;
      userNameText.hidden = false;
      userNameText.textContent = ctx.user.userName;
      dWords.style.display = 'flex';
    }
  }
}
