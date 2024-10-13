import React from 'react';
import { Button } from '@mui/material';
import { SaveIcon, FileOpenIcon } from './index';
import { Locale } from '../../locale';
import type { Session } from '../../types';
import { copyToClipboard } from '../utils';

export const ImportExportButtons: React.FC<Session> = ({
  manager,
  randomizer,
  updateManager,
  setMessage,
}): JSX.Element => {
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
        {Locale.get('ImportExport.Export')}
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
          randomizer.clearOutcomes();
          updateManager();
          setMessage({ text: Locale.get('ImportExport.ImportSuccess'), type: 'success', timeout: 3000 });
        }}>
        <FileOpenIcon />
        {Locale.get('ImportExport.Import')}
      </Button>
    </>
  );
};
