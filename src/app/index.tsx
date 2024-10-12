import React from 'react';
import { Grid2 } from '@mui/material';
import type { AlertMessage, Session } from '../types';
import { Locale } from '../locale';
import { AlertBlock } from './components/alertblock';
import { ImportExportButtons } from './components/importexport';
import { PlayersTable } from './components/players';
import { Randomizer } from './components/randomizer';
import { SettingsToggle } from './components/settingstoggle';
import { Manager } from './manager';

export default function App() {
  const [message, setMessage] = React.useState<AlertMessage | undefined>();
  const [state, setState] = React.useState({ manager: Manager });
  const session: Session = {
    manager: state.manager,
    updateManager: () => {
      state.manager.save();
      setState({ ...state });
    },
    setMessage: (message) => {
      if (!message.text) {
        setMessage(undefined);
      } else {
        setMessage(message);
      }
    },
  };
  return (
    <main>
      <h1>{Locale.get('GenshinRandomizer')}</h1>
      {message && <AlertBlock message={message} onClose={() => setMessage(undefined)} />}
      <PlayersTable {...session} />
      <Grid2 display={'flex'} flexDirection={'row-reverse'}>
        <SettingsToggle {...session} />
        <ImportExportButtons {...session} />
      </Grid2>
      <Randomizer {...session} />
    </main>
  );
}
