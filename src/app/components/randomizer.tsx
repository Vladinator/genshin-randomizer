import React from 'react';
import { Button, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import type { Session, ToggleBoss, Team } from '../../types';
import { type IRandomizerOutcome, IRandomizer } from '../randomizer';
import { Locale } from '../../locale';

const RandomizerOutcome: React.FC<{
  outcome: IRandomizerOutcome;
  randomizer: IRandomizer;
}> = ({ outcome, randomizer }): JSX.Element => {
  const { bosses, teams } = outcome;
  const OutcomeCheckbox: React.FC<{ boss?: ToggleBoss; team?: Team }> = ({ boss, team }): JSX.Element => {
    const unlockText = Locale.get('Randomize.Unlock');
    const lockText = Locale.get('Randomize.Lock');
    return (
      <FormControlLabel
        control={
          boss ? (
            <Checkbox
              inputProps={{ 'aria-label': randomizer.isBossLocked(boss) ? unlockText : lockText }}
              defaultChecked={!!randomizer.isBossLocked(boss)}
              onChange={(e) => {
                randomizer.toggleBoss(boss, e.target.checked);
              }}
            />
          ) : team ? (
            <Checkbox
              inputProps={{ 'aria-label': randomizer.isTeamLocked(team) ? unlockText : lockText }}
              defaultChecked={!!randomizer.isTeamLocked(team)}
              onChange={(e) => {
                randomizer.toggleTeam(team, e.target.checked);
              }}
            />
          ) : (
            <></>
          )
        }
        label={
          boss ? (
            <>{boss.name}</>
          ) : team ? (
            <>
              {team.player.name} — {team.characters.map((o) => o.name).join(', ')}
            </>
          ) : (
            <></>
          )
        }
      />
    );
  };
  return (
    <FormGroup>
      {bosses.map((o) => (
        <OutcomeCheckbox key={o.id} boss={o} />
      ))}
      {teams.map((o) => (
        <OutcomeCheckbox key={o.id} team={o} />
      ))}
    </FormGroup>
  );
};

export const Randomizer: React.FC<Session> = ({ manager, randomizer }): JSX.Element => {
  const [outcomes, setOutcomes] = React.useState(randomizer.getOutcomes());
  return (
    <>
      <Button
        onClick={() => {
          randomizer.load(manager);
          const outcomes = randomizer.randomize();
          setOutcomes(outcomes);
        }}
        variant='contained'>
        {Locale.get('Randomize.Randomize')}
      </Button>
      {outcomes.length ? (
        outcomes.map((outcome) => <RandomizerOutcome key={outcome.id} outcome={outcome} randomizer={randomizer} />)
      ) : (
        <></>
      )}
    </>
  );
};
