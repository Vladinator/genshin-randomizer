import type { UUID, Setting, Player, Character, Team } from '../types';
import { Storage } from './storage';
import { randomUUID, importPayload, inflatePayload, exportPayload } from './utils';

class IManager {
  private settings: Setting[];
  private teams: Team[];

  constructor() {
    this.settings = [];
    this.teams = [];
    this.load();
  }

  public load() {
    this.settings = Storage.getSettings() ?? [];
    this.teams = Storage.getTeams() ?? [];
  }

  public save() {
    Storage.setSettings(this.settings);
    Storage.setTeams(this.teams);
  }

  public import(raw: string): boolean {
    const data = importPayload(raw);
    if (!data) {
      return false;
    }
    const { settings, teams } = inflatePayload(data);
    Storage.setSettings(settings);
    Storage.setTeams(teams);
    this.load();
    return true;
  }

  public export(): string {
    return (
      exportPayload({
        settings: this.settings,
        teams: this.teams,
      }) ?? ''
    );
  }

  public getTeams(): Team[] {
    return this.teams;
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

  private createCharacter(name: string): Character {
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
      let temp = teams.find((o) => o.id === team) ?? teams.find((o) => o.player.id === team);
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

  public addCharacter(team: Team, name: string): Character {
    const character = this.createCharacter(name);
    team.characters.push(character);
    return character;
  }

  public removeCharacter(team: Team, character: Character | UUID): boolean {
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
