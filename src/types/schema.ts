import type { AlertColor } from '@mui/material';
import { z } from 'zod';
import { Manager } from '../app/manager';
import { IRandomizer } from '../app/randomizer';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export const schemaUUID = z.string().uuid();

export const settingKeys = [
  'allowDuplicateBosses',
  'allowDuplicatePlayers',
  'allowDuplicateCharacters',
  'numSessions',
  'numBossesPerSession',
  'numTeamsPerSession',
] as const;

const schemaSettingKeys = z.union([
  z.literal(settingKeys[0]),
  z.literal(settingKeys[1]),
  z.literal(settingKeys[2]),
  z.literal(settingKeys[3]),
  z.literal(settingKeys[4]),
  z.literal(settingKeys[5]),
]);

if (settingKeys.length !== schemaSettingKeys._def.options.length) {
  throw Error(`Schema setting keys array and zod union are not equal!`);
}

export const schemaSetting = z.object({
  key: schemaSettingKeys,
  value: z.number(),
});

export const schemaID = z.object({
  id: schemaUUID,
});

export const schemaName = z.object({
  name: z.string(),
});

export const schemaNameID = schemaID.merge(schemaName);

export const schemaNameArray = z.array(schemaName);

export const schemaNameIDArray = z.array(schemaNameID);

export const schemaTeamName = z.object({
  player: schemaName,
  characters: schemaNameArray,
});

export const schemaTeamNameID = z.object({
  id: schemaUUID,
  player: schemaNameID,
  characters: schemaNameIDArray,
});

export const schemaSettingArray = z.array(schemaSetting);

export const schemaTeamNameArray = z.array(schemaTeamName);

export const schemaTeamNameIDArray = z.array(schemaTeamNameID);

export const schemaIgnore = z.object({
  ignore: z.boolean().optional().default(false),
});

export const schemaIgnoreName = schemaName.merge(schemaIgnore);

export const schemaIgnoreNameID = schemaNameID.merge(schemaIgnore);

export const schemaIgnoreNameArray = z.array(schemaIgnoreName);

export const schemaIgnoreNameIDArray = z.array(schemaIgnoreNameID);

export const schemaPayloadFull = z.object({
  settings: schemaSettingArray,
  characters: schemaIgnoreNameIDArray,
  bosses: schemaIgnoreNameIDArray,
  teams: schemaTeamNameIDArray,
});

export const schemaPayloadMinimal = z.object({
  settings: schemaSettingArray,
  characters: schemaIgnoreNameArray,
  bosses: schemaIgnoreNameArray,
  teams: schemaTeamNameArray,
});

export type Setting = z.infer<typeof schemaSetting>;

export type SettingKVP = Record<Setting['key'], Setting['value']>;

export type ToggleBoss = z.infer<typeof schemaIgnoreNameID>;

export type ToggleCharacter = z.infer<typeof schemaIgnoreNameID>;

export type Player = z.infer<typeof schemaNameID>;

export type Character = z.infer<typeof schemaNameID>;

export type Team = z.infer<typeof schemaTeamNameID>;

export type PayloadFull = z.infer<typeof schemaPayloadFull>;

export type PayloadMinimal = z.infer<typeof schemaPayloadMinimal>;

export type AlertMessage = {
  text: string;
  type?: AlertColor;
  timeout?: number;
  noCloseButton?: boolean;
};

export type Session = {
  manager: typeof Manager;
  randomizer: IRandomizer;
  editing: boolean;
  updateManager: (value: React.SetStateAction<void>) => void;
  updateEditing: (value: boolean) => void;
  setMessage: (message: AlertMessage) => void;
};
