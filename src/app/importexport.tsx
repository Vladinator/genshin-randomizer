import React from 'react';
import { Button } from '@mui/material';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import SaveIcon from '@mui/icons-material/Save';
import type { Session } from '../types';
import { copyToClipboard } from './utils';

export const ImportExportButtons: React.FC<Session> = ({ manager, updateManager, setMessage }): JSX.Element => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          const data = manager.export();
          setMessage({
            text: 'Copy this import string for later:',
            type: 'success',
            copyableData: data,
          });
          copyToClipboard(data);
        }}>
        <SaveIcon />
        Export
      </Button>
      <Button
        variant='text'
        onClick={() => {
          const data = prompt('Paste import string:', '');
          if (!data) {
            return;
          }
          if (!manager.import(data)) {
            setMessage({ text: 'Unable to load what you pasted.', type: 'error' });
            return;
          }
          updateManager();
          setMessage({ text: 'Loaded!', type: 'success', timeout: 3000 });
        }}>
        <FileOpenIcon />
        Import
      </Button>
    </>
  );
};
