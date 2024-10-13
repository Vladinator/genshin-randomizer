import {
  type UUID,
  type Setting,
  type SettingKVP,
  type ToggleBoss,
  type ToggleCharacter,
  type Team,
  type Character,
  settingKeys,
} from '../types';
import { Manager } from './manager';
import { randomInt, randomUUID } from './utils';

export type IRandomizerOutcome = {
  id: UUID;
  bosses: ToggleBoss[];
  teams: Team[];
};

export class IRandomizer {
  private settings: Setting[];
  private bosses: ToggleBoss[];
  private characters: ToggleCharacter[];
  private teams: Team[];
  private lockedBosses: ToggleBoss[];
  private lockedCharacters: ToggleCharacter[];
  private lockedTeams: Team[];
  private outcomes: IRandomizerOutcome[];

  constructor() {
    this.settings = [];
    this.bosses = [];
    this.characters = [];
    this.teams = [];
    this.lockedBosses = [];
    this.lockedCharacters = [];
    this.lockedTeams = [];
    this.outcomes = [];
  }

  private cleanOrphans<T extends Team | ToggleBoss | ToggleCharacter>(lockedItems: T[], items: T[]) {
    for (let i = lockedItems.length - 1; i >= 0; i--) {
      const lockedItem = lockedItems[i];
      let item = items.find((o) => o.id === lockedItem.id);
      if (item) {
        continue;
      }
      if ('player' in lockedItem) {
        item = (items as Team[]).find((o) => o.player.id === lockedItem.player.id) as T;
      }
      if (item) {
        continue;
      }
      lockedItems.splice(i, 1);
    }
  }

  public load(manager: typeof Manager) {
    this.settings = manager.getSettings();
    this.bosses = manager.getBosses(true);
    this.characters = manager.getCharacters(true);
    this.teams = manager.getTeams();
    this.cleanOrphans(this.lockedBosses, this.bosses);
    this.cleanOrphans(this.lockedCharacters, this.characters);
    this.cleanOrphans(this.lockedTeams, this.teams);
  }

  public static create(manager: typeof Manager): IRandomizer {
    const instance = new this();
    instance.load(manager);
    return instance;
  }

  public getSettings(): Setting[] {
    return this.settings;
  }

  public getSettingsKVP(): SettingKVP {
    const { settings } = this;
    const items: Partial<SettingKVP> = {};
    for (const key of settingKeys) {
      const item = settings.find((o) => o.key === key);
      items[key] = item ? item.value : 0;
    }
    return items as SettingKVP;
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

  public getOutcomes(): IRandomizerOutcome[] {
    return this.outcomes;
  }

  public clearOutcomes() {
    this.outcomes.splice(0, this.outcomes.length);
  }

  public randomize(): IRandomizerOutcome[] {
    const settings = this.getSettingsKVP();
    const outcomes: IRandomizerOutcome[] = [...this.outcomes];
    for (let i = 0; i < settings.numSessions; i++) {
      let outcome = outcomes[i];
      if (!outcome) {
        outcome = {} as never;
        outcomes[i] = outcome;
      }
      this.randomizeSession(settings, outcome);
    }
    this.outcomes = outcomes;
    return outcomes;
  }

  private isOutcomeSafe(outcome: Partial<IRandomizerOutcome>): outcome is IRandomizerOutcome {
    return 'id' in outcome && 'bosses' in outcome && 'teams' in outcome;
  }

  private removeUnlocked<T>(items: T[], predicate: (item: T) => T | undefined) {
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (predicate(item)) {
        continue;
      }
      items[i] = undefined as never;
    }
  }

  private trimUndefined<T>(items: T[]) {
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (item) {
        continue;
      }
      items.splice(i, 1);
    }
  }

  private randomizeSession(settings: SettingKVP, outcome: Partial<IRandomizerOutcome>) {
    if (!outcome.id) outcome.id = randomUUID();
    if (!outcome.bosses) outcome.bosses = [];
    if (!outcome.teams) outcome.teams = [];
    if (!this.isOutcomeSafe(outcome)) throw Error(`Outcome object is not properly initialized!`);
    const {
      allowDuplicateBosses,
      allowDuplicatePlayers,
      allowDuplicateCharacters,
      numBossesPerSession,
      numTeamsPerSession,
    } = settings;
    const { bosses, teams } = outcome;
    this.removeUnlocked(bosses, (o) => this.isBossLocked(o));
    this.removeUnlocked(teams, (o) => this.isTeamLocked(o));
    bosses.splice(numBossesPerSession, bosses.length);
    teams.splice(numTeamsPerSession, teams.length);
    for (let i = 0; i < numBossesPerSession; i++) {
      const boss = bosses[i] as ToggleBoss | undefined;
      if (boss && this.isBossLocked(boss)) {
        continue;
      }
      const temp = this.getRandomBoss(outcome, !!allowDuplicateBosses);
      if (!temp) {
        bosses.splice(i + 1, bosses.length);
        break;
      }
      bosses[i] = temp;
    }
    for (let i = 0; i < numTeamsPerSession; i++) {
      const team = teams[i] as Team | undefined;
      if (team && this.isTeamLocked(team)) {
        continue;
      }
      const temp = this.getRandomTeam(outcome, !!allowDuplicatePlayers, !!allowDuplicateCharacters);
      if (!temp) {
        teams.splice(i + 1, teams.length);
        break;
      }
      teams[i] = temp;
    }
    this.trimUndefined(bosses);
    this.trimUndefined(teams);
  }

  private getRandomBoss(outcome: IRandomizerOutcome, dupeBosses: boolean): ToggleBoss | undefined {
    if (dupeBosses) {
      return this.bosses[randomInt(this.bosses.length)];
    }
    const bosses = outcome.bosses.filter((o) => o);
    const pool = [...this.bosses];
    let boss: ToggleBoss | undefined;
    while (!boss) {
      if (!pool.length) break;
      const index = randomInt(pool.length);
      boss = pool[index];
      // eslint-disable-next-line no-loop-func
      if (bosses.find((o) => o.name === boss?.name)) {
        pool.splice(index, 1);
        boss = undefined;
        continue;
      }
      break;
    }
    return boss;
  }

  private getRandomTeam(outcome: IRandomizerOutcome, dupePlayers: boolean, dupeCharacters: boolean): Team | undefined {
    const teams = outcome.teams.filter((o) => o);
    const pool = [...this.teams];
    let team: Team | undefined;
    while (!team) {
      if (!pool.length) break;
      const index = randomInt(pool.length);
      team = pool[index];
      // eslint-disable-next-line no-loop-func
      if (!dupePlayers && teams.find((o) => o.player.name === team?.player.name)) {
        pool.splice(index, 1);
        team = undefined;
        continue;
      }
      break;
    }
    if (!team) {
      return;
    }
    return this.getRandomCharacter(outcome, team, dupeCharacters);
  }

  private getRandomCharacter(outcome: IRandomizerOutcome, teamRoster: Team, dupeCharacters: boolean): Team {
    const teamCharacters = teamRoster.characters;
    const pool = [...this.characters].filter((o) => teamCharacters.find((p) => o.name === p.name));
    const team = { ...teamRoster };
    team.characters = [];
    if (dupeCharacters) {
      const poolCharacter = pool[randomInt(pool.length)];
      const character = teamCharacters.find((o) => o.name === poolCharacter.name);
      if (character) team.characters.push(character);
      return team;
    }
    const allTeamsCharacters = (outcome.teams as (Team | undefined)[]).reduce((pv, cv) => {
      if (!cv) {
        return pv;
      }
      for (const o of cv.characters) {
        if (pool.find((p) => p.name === o.name)) {
          pv.push(o);
        }
      }
      return pv;
    }, [] as Character[]);
    let character: Character | undefined;
    while (!character) {
      if (!pool.length) break;
      const index = randomInt(pool.length);
      character = pool[index];
      // eslint-disable-next-line no-loop-func
      if (allTeamsCharacters.find((o) => o.name === character?.name)) {
        pool.splice(index, 1);
        character = undefined;
        continue;
      }
      break;
    }
    if (!character) {
      return team;
    }
    team.characters.push(character);
    return team;
  }
}
