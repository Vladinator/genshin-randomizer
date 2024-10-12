import React from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Session, Team, Character } from '../types';

const CharacterCellContents: React.FC<Session & { team: Team; character: Character }> = ({
  manager,
  updateManager,
  team,
  character,
}): JSX.Element => {
  return (
    <>
      <TextField
        value={character.name}
        onChange={(e) => {
          character.name = e.target.value;
          updateManager();
        }}
        variant='standard'
      />
      <IconButton
        aria-label={`delete character ${character.name}`}
        onClick={() => {
          manager.removeCharacter(team, character);
          updateManager();
        }}>
        <RemoveIcon />
      </IconButton>
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
      aria-label={`add character to ${team.player.name}`}
      onClick={() => {
        manager.addCharacter(team, '');
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
      <Table aria-label='players table'>
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
                />
                <IconButton
                  aria-label='delete player'
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
                aria-label='new player'
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
