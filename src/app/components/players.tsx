import React from 'react';
import {
  Autocomplete,
  Grid2,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { AddIcon, DeleteIcon, RemoveIcon } from './index';
import type { Session, Team, Character } from '../../types';
import { Locale } from '../../locale';

const CharacterCellContents: React.FC<Session & { team: Team; character: Character }> = ({
  manager,
  updateManager,
  editing,
  team,
  character,
}): JSX.Element => {
  const characters = manager.getCharacters(true);
  const value = characters.find((o) => o.name === character.name);
  const hasDuplicates = !manager.getSetting('allowDuplicateCharacters')
    ? team.characters.filter((o) => o.name === value?.name).length > 1
    : false;
  if (!editing) {
    return <Typography color={hasDuplicates ? 'error' : 'textPrimary'}>{value?.name}</Typography>;
  }
  // TODO: `MUI: A component is changing the uncontrolled value state of Autocomplete to be controlled.`
  return (
    <>
      <Autocomplete
        style={{ minWidth: 222 + 48 }}
        disablePortal
        options={characters}
        getOptionKey={(option) => option.id}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(_, newValue) => {
          if (!newValue) {
            return;
          }
          character.name = newValue.name;
          updateManager();
        }}
        renderInput={(params) => (
          <Grid2>
            <TextField //
              {...params}
              variant='standard'
              size='small'
              fullWidth={false}
              style={{ minWidth: 222 }}
              color={hasDuplicates ? 'error' : 'primary'}
            />
            <IconButton
              onClick={() => {
                if (!window.confirm(Locale.get('Confirm.Delete', character.name))) return;
                manager.removeTeamCharacter(team, character);
                updateManager();
              }}
              color='error'>
              <RemoveIcon />
            </IconButton>
          </Grid2>
        )}
        disableClearable={true}
        autoComplete={true}
        disableListWrap={true}
        openOnFocus={false}
        blurOnSelect={true}
        clearOnBlur={true}
      />
    </>
  );
};

const CharacterCellAddContents: React.FC<Session & { team: Team }> = ({
  manager,
  updateManager,
  team,
}): JSX.Element => {
  return (
    <IconButton
      aria-label={Locale.get('Players.AddCharacterToTeam', team.player.name)}
      onClick={() => {
        manager.addTeamCharacter(team, '');
        updateManager();
      }}
      color='success'>
      <AddIcon />
    </IconButton>
  );
};

export const PlayersTable: React.FC<Session> = (props): JSX.Element => {
  const { manager, updateManager, editing } = props;
  const teams = manager.getTeams();
  const numRows =
    (editing ? 1 : 0) + teams.reduce((pv, cv) => (pv > cv.characters.length ? pv : cv.characters.length), 0);
  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table aria-label={Locale.get('Players.Players')} size='small'>
        <TableHead>
          <TableRow>
            {teams.map((team) => {
              const hasDuplicates = teams.reduce((pv, cv) => pv + (cv.player.name === team.player.name ? 1 : 0), 0) > 1;
              return (
                <TableCell key={team.id}>
                  {editing ? (
                    <>
                      <TextField
                        value={team.player.name}
                        onChange={(e) => {
                          team.player.name = e.target.value;
                          updateManager();
                        }}
                        variant='standard'
                        size='small'
                        fullWidth={false}
                        style={{ minWidth: 222 }}
                        color={hasDuplicates ? 'error' : 'primary'}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <IconButton
                                aria-label={Locale.get('Players.DeletePlayer')}
                                onClick={() => {
                                  if (!window.confirm(Locale.get('Confirm.Delete', team.player.name))) return;
                                  manager.removeTeam(team);
                                  updateManager();
                                }}
                                color='error'>
                                <DeleteIcon />
                              </IconButton>
                            ),
                          },
                        }}
                      />
                    </>
                  ) : (
                    <Typography color={hasDuplicates ? 'error' : 'textPrimary'}>
                      <strong>{team.player.name}</strong>
                    </Typography>
                  )}
                </TableCell>
              );
            })}
            <TableCell>
              {editing ? (
                <IconButton
                  aria-label={Locale.get('Players.NewPlayer')}
                  onClick={() => {
                    manager.addTeam('Player');
                    updateManager();
                  }}
                  color='success'>
                  <AddIcon />
                </IconButton>
              ) : (
                <></>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {new Array(numRows).fill(0).map((_, index, temp) => (
            <TableRow key={`${index}`}>
              {teams.map((team) => (
                <TableCell key={`${team.id}`}>
                  {team.characters[index] ? (
                    <>
                      <CharacterCellContents {...props} team={team} character={team.characters[index]} />
                    </>
                  ) : !temp[team.id as never] && (temp[team.id as never] = true) ? (
                    <>{editing ? <CharacterCellAddContents {...props} team={team} /> : <></>}</>
                  ) : (
                    <></>
                  )}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
