import { PageName } from './constants';

export type TextBookContext = {
  pageId: number;
  groupId: number;
};

export function resetTextBookContext() {
  return {
    pageId: 0,
    groupId: 0,
  };
}

export type AuthContext = {
  userName: string;
  userEmail: string;
  token: string;
  tokenRefresh: string;
  id: string;
};

export function resetAuthContext() {
  return {
    userName: '',
    userEmail: '',
    token: '',
    tokenRefresh: '',
    id: '',
  };
}

export type PageContext = {
  pageName: PageName;
  user: AuthContext;
  book: TextBookContext;
};

export interface Content {}

export interface WordContent extends Content {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string
}

export interface AudiocallContent extends Content {
  book: TextBookContext;
  replacement: HTMLElement;
  parent: HTMLElement;
}

export interface SigninContext {
  email: string,
  password: string
}

export interface SignupContext {
  name: string,
  email: string,
  password: string
}
