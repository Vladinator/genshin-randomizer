import type { Team, ToggleBoss, ToggleCharacter } from '../types';
import { Manager } from './manager';

export class IRandomizer {
  private bosses: ToggleBoss[];
  private characters: ToggleCharacter[];
  private teams: Team[];
  private lockedBosses: ToggleBoss[];
  private lockedCharacters: ToggleCharacter[];
  private lockedTeams: Team[];

  constructor(bosses: ToggleBoss[], characters: ToggleCharacter[], teams: Team[]) {
    this.bosses = bosses;
    this.characters = characters;
    this.teams = teams;
    this.lockedBosses = [];
    this.lockedCharacters = [];
    this.lockedTeams = [];
  }

  public static create(manager: typeof Manager): IRandomizer {
    const bosses = manager.getBosses(true);
    const characters = manager.getCharacters(true);
    const teams = manager.getTeams();
    return new this(bosses, characters, teams);
  }

  public getBosses(): ToggleBoss[] {
    return this.bosses;
  }

  public getCharacters(): ToggleCharacter[] {
    return this.characters;
  }

  public getTeams(): Team[] {
    return this.teams;
  }

  public isBossLocked(boss: ToggleBoss): ToggleBoss | undefined {
    return this.lockedBosses.find((o) => o.id === boss.id);
  }

  public lockBoss(boss: ToggleBoss) {
    const { lockedBosses } = this;
    if (this.isBossLocked(boss)) {
      return;
    }
    lockedBosses.push(boss);
  }

  public unlockBoss(boss: ToggleBoss) {
    const { lockedBosses } = this;
    const temp = this.isBossLocked(boss);
    if (!temp) {
      return;
    }
    const index = lockedBosses.indexOf(temp);
    lockedBosses.splice(index, 1);
  }

  public toggleBoss(boss: ToggleBoss, lock?: boolean) {
    if (lock === undefined) {
      lock = !this.isBossLocked(boss);
    }
    if (lock) {
      this.lockBoss(boss);
    } else {
      this.unlockBoss(boss);
    }
  }

  public isCharacterLocked(character: ToggleCharacter): ToggleCharacter | undefined {
    return this.lockedCharacters.find((o) => o.id === character.id);
  }

  public lockCharacter(character: ToggleCharacter) {
    const { lockedCharacters } = this;
    if (this.isCharacterLocked(character)) {
      return;
    }
    lockedCharacters.push(character);
  }

  public unlockCharacter(character: ToggleCharacter) {
    const { lockedCharacters } = this;
    const temp = this.isCharacterLocked(character);
    if (!temp) {
      return;
    }
    const index = lockedCharacters.indexOf(temp);
    lockedCharacters.splice(index, 1);
  }

  public toggleCharacter(character: ToggleCharacter, lock?: boolean) {
    if (lock === undefined) {
      lock = !this.isCharacterLocked(character);
    }
    if (lock) {
      this.lockCharacter(character);
    } else {
      this.unlockCharacter(character);
    }
  }

  public isTeamLocked(team: Team): Team | undefined {
    return this.lockedTeams.find((o) => o.id === team.id);
  }

  public lockTeam(team: Team) {
    const { lockedTeams } = this;
    if (this.isTeamLocked(team)) {
      return;
    }
    lockedTeams.push(team);
  }

  public unlockTeam(team: Team) {
    const { lockedTeams } = this;
    const temp = this.isTeamLocked(team);
    if (!temp) {
      return;
    }
    const index = lockedTeams.indexOf(temp);
    lockedTeams.splice(index, 1);
  }

  public toggleTeam(team: Team, lock?: boolean) {
    if (lock === undefined) {
      lock = !this.isTeamLocked(team);
    }
    if (lock) {
      this.lockTeam(team);
    } else {
      this.unlockTeam(team);
    }
  }
}
