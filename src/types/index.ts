import type { AlertColor } from '@mui/material';
import { z } from 'zod';
import { Manager } from '../app/manager';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export const schemaUUID = z.string().uuid();

export const schemaSetting = z.object({
  key: z.string(),
  value: z.any(),
});

export const schemaID = z.object({
  id: schemaUUID,
});

export const schemaName = z.object({
  name: z.string(),
});

export const schemaNameID = schemaID.merge(schemaName);

export const schemaTeamName = z.object({
  player: schemaName,
  characters: z.array(schemaName),
});

export const schemaTeamNameID = z.object({
  id: schemaUUID,
  player: schemaNameID,
  characters: z.array(schemaNameID),
});

export const schemaSettingArray = z.array(schemaSetting);

export const schemaTeamNameArray = z.array(schemaTeamName);

export const schemaTeamNameIDArray = z.array(schemaTeamNameID);

export const schemaPayloadFull = z.object({
  settings: schemaSettingArray,
  teams: schemaTeamNameIDArray,
});

export const schemaPayloadMinimal = z.object({
  settings: schemaSettingArray,
  teams: schemaTeamNameArray,
});

export type Setting = z.infer<typeof schemaSetting>;

export type Player = z.infer<typeof schemaNameID>;

export type Character = z.infer<typeof schemaNameID>;

export type Team = z.infer<typeof schemaTeamNameID>;

export type PayloadFull = z.infer<typeof schemaPayloadFull>;

export type PayloadMinimal = z.infer<typeof schemaPayloadMinimal>;

export type AlertMessage = {
  text: string;
  type?: AlertColor;
  timeout?: number;
  copyableData?: string;
  noCloseButton?: boolean;
};

export type Session = {
  manager: typeof Manager;
  updateManager: (value: React.SetStateAction<void>) => void;
  setMessage: (message: AlertMessage) => void;
};
