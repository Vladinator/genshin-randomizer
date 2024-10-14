import type { ToggleBoss, ToggleCharacter, Setting, Team } from '../types';

const settingsKey = 'settings';
const bossesKey = 'bosses';
const charactersKey = 'characters';
const teamsKey = 'teams';

export class Storage {
  private static read(key: string, json?: boolean) {
    const data = localStorage.getItem(key);
    if (!json) {
      return data;
    }
    if (!data) {
      return;
    }
    try {
      return JSON.parse(data);
    } catch {}
  }

  private static write(key: string, value: any, json?: boolean) {
    const data = json ? JSON.stringify(value) : value;
    localStorage.setItem(key, data);
  }

  private static clear(key: string) {
    localStorage.removeItem(key);
  }

  public static clearAll() {
    this.clearSettings();
    this.clearBosses();
    this.clearCharacters();
    this.clearTeams();
  }

  public static getSettings(): Setting[] | undefined {
    return this.read(settingsKey, true);
  }

  public static setSettings(settings: Setting[]) {
    return this.write(settingsKey, settings, true);
  }

  public static clearSettings() {
    this.clear(settingsKey);
  }

  public static getBosses(): ToggleBoss[] | undefined {
    return this.read(bossesKey, true);
  }

  public static setBosses(bosses: ToggleBoss[]) {
    return this.write(bossesKey, bosses, true);
  }

  public static clearBosses() {
    this.clear(bossesKey);
  }

  public static getCharacters(): ToggleCharacter[] | undefined {
    return this.read(charactersKey, true);
  }

  public static setCharacters(characters: ToggleCharacter[]) {
    return this.write(charactersKey, characters, true);
  }

  public static clearCharacters() {
    this.clear(charactersKey);
  }

  public static getTeams(): Team[] | undefined {
    return this.read(teamsKey, true);
  }

  public static setTeams(teams: Team[]) {
    return this.write(teamsKey, teams, true);
  }

  public static clearTeams() {
    this.clear(teamsKey);
  }
}
