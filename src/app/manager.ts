import type { UUID, Setting, ToggleBoss, ToggleCharacter, Player, Character, Team } from '../types';
import { Bosses, Characters } from '../game';
import { Storage } from './storage';
import { randomUUID, importPayload, inflatePayload, exportPayload } from './utils';

const DefaultSettings: Setting[] = [
  //
  { key: 'allowDuplicateBosses', value: 0 },
  { key: 'allowDuplicatePlayers', value: 0 },
  { key: 'allowDuplicateCharacters', value: 0 },
  { key: 'numSessions', value: 1 },
  { key: 'numBossesPerSession', value: 1 },
  { key: 'numTeamsPerSession', value: 4 },
];

const DefaultBosses: ToggleBoss[] = Bosses.map((name) => ({ id: randomUUID(), ignore: false, name }));

const DefaultCharacters: ToggleCharacter[] = Characters.map((name) => ({ id: randomUUID(), ignore: false, name }));

const DefaultTeams: Team[] = [];

const isNotIgnored = (item: ToggleBoss | ToggleCharacter): boolean => {
  return item.ignore !== true;
};

class IManager {
  private settings: Setting[];
  private bosses: ToggleBoss[];
  private characters: ToggleCharacter[];
  private teams: Team[];

  constructor() {
    this.settings = [];
    this.bosses = [];
    this.characters = [];
    this.teams = [];
    this.load();
  }

  public load() {
    this.settings = Storage.getSettings() ?? DefaultSettings;
    this.bosses = Storage.getBosses() ?? DefaultBosses;
    this.characters = Storage.getCharacters() ?? DefaultCharacters;
    this.teams = Storage.getTeams() ?? DefaultTeams;
  }

  public save() {
    const { settings, bosses, characters, teams } = this;
    Storage.setSettings(settings);
    Storage.setBosses(bosses);
    Storage.setCharacters(characters);
    Storage.setTeams(teams);
  }

  public import(raw: string): boolean {
    const data = importPayload(raw.trim());
    if (!data) {
      return false;
    }
    const { settings, bosses, characters, teams } = inflatePayload(data);
    Storage.setSettings(settings);
    Storage.setBosses(bosses);
    Storage.setCharacters(characters);
    Storage.setTeams(teams);
    this.load();
    return true;
  }

  public export(): string {
    const { settings, bosses, characters, teams } = this;
    return exportPayload({ settings, bosses, characters, teams }) ?? '';
  }

  public getSettings(): Setting[] {
    return this.settings;
  }

  public getBosses(skipIgnored?: boolean): ToggleBoss[] {
    if (skipIgnored) {
      return this.bosses.filter(isNotIgnored);
    }
    return this.bosses;
  }

  public getCharacters(skipIgnored?: boolean): ToggleCharacter[] {
    if (skipIgnored) {
      return this.characters.filter(isNotIgnored);
    }
    return this.characters;
  }

  public getTeams(): Team[] {
    return this.teams;
  }

  public createBoss(name: string, ignore?: boolean): ToggleBoss {
    return {
      id: randomUUID(),
      name,
      ignore: !!ignore,
    };
  }

  public createCharacter(name: string, ignore?: boolean): ToggleCharacter {
    return {
      id: randomUUID(),
      name,
      ignore: !!ignore,
    };
  }

  public addBoss(name: string, ignore?: boolean): ToggleBoss {
    const boss = this.createBoss(name, ignore);
    this.bosses.push(boss);
    return boss;
  }

  public removeBoss(boss: ToggleBoss): boolean;
  public removeBoss(bossUUID: UUID): boolean;

  public removeBoss(boss: ToggleBoss | UUID): boolean {
    const { bosses } = this;
    if (typeof boss === 'string') {
      const temp = bosses.find((o) => o.id === boss);
      if (!temp) {
        return false;
      }
      boss = temp;
    }
    const index = bosses.indexOf(boss);
    if (index > -1) {
      bosses.splice(index, 1);
      return true;
    }
    return false;
  }

  public addCharacter(name: string, ignore?: boolean): ToggleCharacter {
    const character = this.createCharacter(name, ignore);
    this.characters.push(character);
    return character;
  }

  public removeCharacter(character: ToggleCharacter): boolean;
  public removeCharacter(characterUUID: UUID): boolean;

  public removeCharacter(character: ToggleBoss | UUID): boolean {
    const { characters } = this;
    if (typeof character === 'string') {
      const temp = characters.find((o) => o.id === character);
      if (!temp) {
        return false;
      }
      character = temp;
    }
    const index = characters.indexOf(character);
    if (index > -1) {
      characters.splice(index, 1);
      return true;
    }
    return false;
  }

  private createTeam(name: string): Team {
    return {
      id: randomUUID(),
      player: this.createPlayer(name),
      characters: [],
    };
  }

  private createPlayer(name: string): Player {
    return {
      id: randomUUID(),
      name,
    };
  }

  private createTeamCharacter(name: string): Character {
    return {
      id: randomUUID(),
      name,
    };
  }

  public addTeam(name: string): Team {
    const team = this.createTeam(name);
    this.teams.push(team);
    return team;
  }

  public removeTeam(team: Team): boolean;
  public removeTeam(teamUUID: UUID): boolean;
  public removeTeam(playerUUID: UUID): boolean;

  public removeTeam(team: Team | UUID): boolean {
    const { teams } = this;
    if (typeof team === 'string') {
      const temp = teams.find((o) => o.id === team) ?? teams.find((o) => o.player.id === team);
      if (!temp) {
        return false;
      }
      team = temp;
    }
    const index = teams.indexOf(team);
    if (index > -1) {
      teams.splice(index, 1);
      return true;
    }
    return false;
  }

  public addTeamCharacter(team: Team, name: string): Character {
    const character = this.createTeamCharacter(name);
    team.characters.push(character);
    return character;
  }

  public removeTeamCharacter(team: Team, character: Character | UUID): boolean {
    const { characters } = team;
    if (typeof character === 'string') {
      let temp = characters.find((o) => o.id === character);
      if (!temp) {
        return false;
      }
      character = temp;
    }
    const index = characters.indexOf(character);
    if (index > -1) {
      characters.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const Manager = new IManager();
