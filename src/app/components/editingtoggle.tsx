import React from 'react';
import { Button } from '@mui/material';
import ToggleOffIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
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
