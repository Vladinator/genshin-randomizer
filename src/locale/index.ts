import type { StringifyObject, KeyPaths, ValueFromPath } from '../types';
import enUS from './en-US';

const DefaultLanguage = enUS;

type IDefaultLanguage = typeof DefaultLanguage;

export type Language = StringifyObject<IDefaultLanguage>;

export type LanguageKeys = KeyPaths<Language>;

type FormatArg = string | number | boolean;

class ILocale {
  private language: Language;

  constructor() {
    this.language = DefaultLanguage;
  }

  public setLanguage(language: Language) {
    this.language = language;
  }

  private format(text: string, args: FormatArg[]): string {
    if (!args.length) {
      return text;
    }
    let index = -1;
    while ((index = text.indexOf('{}')) > -1) {
      if (args.length === 0) {
        break;
      }
      let arg = args.shift();
      if (arg === undefined || arg === null) {
        arg = '';
      }
      text = `${text.substring(0, index)}${arg}${text.substring(index + 2)}`;
    }
    return text;
  }

  private getPath(obj: any, path: string[]): string {
    return path.reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }

  private getTranslation<T extends LanguageKeys>(
    language: Language,
    key: T,
    ...args: FormatArg[]
  ): ValueFromPath<Language, T> {
    const path = key.split('.');
    let text = this.getPath(language, path);
    if (text === undefined) {
      return key as never;
    }
    text = this.format(text, args);
    return text as never;
  }

  public get<T extends LanguageKeys>(key: T, ...args: FormatArg[]): ValueFromPath<IDefaultLanguage, T> {
    return this.getTranslation(this.language, key, ...args) as never;
  }
}

export const Locale = new ILocale();
