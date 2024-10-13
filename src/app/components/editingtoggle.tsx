import React from 'react';
import { Button } from '@mui/material';
import { ToggleOffIcon, ToggleOnIcon } from './index';
import type { Session } from '../../types';
import { Locale } from '../../locale';

export const EditingToggle: React.FC<Session> = ({ editing, updateEditing }): JSX.Element => {
  return (
    <Button
      variant='text'
      onClick={() => {
        updateEditing(!editing);
      }}>
      {!editing ? <ToggleOffIcon /> : <ToggleOnIcon />}
      {Locale.get('Players.Edit')}
    </Button>
  );
};
