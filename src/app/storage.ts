import type { Setting, Team } from '../types';

const settingsKey = 'settings';
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

  public static getSettings(): Setting[] | undefined {
    return this.read(settingsKey, true);
  }

  public static setSettings(settings: Setting[]) {
    return this.write(settingsKey, settings, true);
  }

  public static getTeams(): Team[] | undefined {
    return this.read(teamsKey, true);
  }

  public static setTeams(teams: Team[]) {
    return this.write(teamsKey, teams, true);
  }
}
