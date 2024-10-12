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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Session, Team, Character } from '../../types';
import { Locale } from '../../locale';

const CharacterCellContents: React.FC<Session & { team: Team; character: Character }> = ({
  manager,
  updateManager,
  team,
  character,
}): JSX.Element => {
  const characters = manager.getCharacters(true);
  const value = characters.find((o) => o.name === character.name);
  // TODO: `MUI: A component is changing the uncontrolled value state of Autocomplete to be controlled.`
  return (
    <>
      <Autocomplete
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
            <TextField
              //
              {...params}
              variant='standard'
              size='small'
              fullWidth={false}
              style={{ minWidth: 200 }}
            />
            <IconButton
              onClick={() => {
                manager.removeTeamCharacter(team, character);
                updateManager();
              }}>
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
      }}>
      <AddIcon />
    </IconButton>
  );
};

export const PlayersTable: React.FC<Session> = (props): JSX.Element => {
  const { manager, updateManager } = props;
  const teams = manager.getTeams();
  const numRows = 1 + teams.reduce((pv, cv) => (pv > cv.characters.length ? pv : cv.characters.length), 0);
  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table aria-label={Locale.get('Players.Players')} size='small'>
        <TableHead>
          <TableRow>
            {teams.map((team) => (
              <TableCell key={team.id}>
                <TextField
                  value={team.player.name}
                  onChange={(e) => {
                    team.player.name = e.target.value;
                    updateManager();
                  }}
                  variant='standard'
                  size='small'
                />
                <IconButton
                  aria-label={Locale.get('Players.DeletePlayer')}
                  onClick={() => {
                    manager.removeTeam(team);
                    updateManager();
                  }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            ))}
            <TableCell>
              <IconButton
                aria-label={Locale.get('Players.NewPlayer')}
                onClick={() => {
                  manager.addTeam('Player');
                  updateManager();
                }}>
                <AddIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {new Array(numRows).fill(0).map((_, index, temp) => (
            <TableRow key={`${index}`}>
              {teams.map((team) => (
                <TableCell key={`${team.id}`}>
                  {team.characters[index] ? (
                    <CharacterCellContents {...props} team={team} character={team.characters[index]} />
                  ) : !temp[team.id as never] && (temp[team.id as never] = true) ? (
                    <CharacterCellAddContents {...props} team={team} />
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
