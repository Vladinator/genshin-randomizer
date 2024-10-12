import React from 'react';
import { Button } from '@mui/material';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import SaveIcon from '@mui/icons-material/Save';
import type { Session } from '../../types';
import { copyToClipboard } from '../utils';
import { Locale } from '../../locale';

export const ImportExportButtons: React.FC<Session> = ({ manager, updateManager, setMessage }): JSX.Element => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          const data = manager.export();
          copyToClipboard(data).then((result) => {
            if (result !== true) {
              setMessage({
                text: result ? result.message : Locale.get('ImportExport.ExportClipboardError'),
                type: 'error',
              });
              return;
            }
            setMessage({
              text: Locale.get('ImportExport.ExportClipboardSuccess'),
              type: 'success',
            });
          });
        }}>
        <SaveIcon />
        Export
      </Button>
      <Button
        variant='text'
        onClick={() => {
          const data = prompt(Locale.get('ImportExport.ImportPasteHere'), '');
          if (!data) {
            return;
          }
          if (!manager.import(data)) {
            setMessage({
              text: Locale.get('ImportExport.ImportError'),
              type: 'error',
            });
            return;
          }
          updateManager();
          setMessage({ text: Locale.get('ImportExport.ImportSuccess'), type: 'success', timeout: 3000 });
        }}>
        <FileOpenIcon />
        Import
      </Button>
    </>
  );
};
