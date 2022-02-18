import { PageName } from './constants';

export type TextBookContext = {
  pageId: number;
  groupId: number;
};

export type AuthContext = {
  username: string;
  token: string;
};

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
