import React from 'react';
import { Button } from '@mui/material';
import type { Session } from '../../types';
import { IRandomizer } from '../randomizer';

export const Randomizer: React.FC<Session> = (props): JSX.Element => {
  const { manager } = props;
  const [state, setState] = React.useState({ randomizer: IRandomizer.create(manager) });
  return (
    <Button
      onClick={() => {
        const { randomizer } = state;
        const bosses = randomizer.getBosses();
        const characters = randomizer.getCharacters();
        const teams = randomizer.getTeams();
        randomizer.toggleBoss(bosses[0]);
        randomizer.toggleCharacter(characters[0]);
        randomizer.toggleTeam(teams[0]);
        console.warn(bosses, randomizer.isBossLocked(bosses[0]));
        console.warn(characters, randomizer.isCharacterLocked(characters[0]));
        console.warn(teams, randomizer.isTeamLocked(teams[0]));
        setState({ randomizer });
      }}
      variant='contained'>
      Randomize
    </Button>
  );
};
