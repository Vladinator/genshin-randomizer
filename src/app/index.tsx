import React from 'react';
import { Grid2 } from '@mui/material';
import type { AlertMessage, Session } from '../types';
import { Locale } from '../locale';
import { AlertBlock } from './components/alertblock';
import { AppTabs } from './components/apptabs';
import { ImportExportButtons } from './components/importexport';
import { PlayersTable } from './components/players';
import { Randomizer } from './components/randomizer';
import { EditingToggle } from './components/editingtoggle';
import { SettingsToggle } from './components/settingstoggle';
import { Manager } from './manager';
import { IRandomizer } from './randomizer';

export const App: React.FC<{}> = (): JSX.Element => {
  const [message, setMessage] = React.useState<AlertMessage | undefined>();
  const [state, setState] = React.useState({ manager: Manager, randomizer: new IRandomizer(), editing: false });
  const session: Session = {
    manager: state.manager,
    randomizer: state.randomizer,
    editing: state.editing,
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
    updateEditing: (editing) => {
      setState({ ...state, editing });
    },
  };
  return (
    <main>
      <h1>{Locale.get('GenshinRandomizer')}</h1>
      {message && <AlertBlock message={message} onClose={() => setMessage(undefined)} />}
      <AppTabs
        tabs={[
          {
            tab: {
              label: Locale.get('Tabs.Players'),
            },
            panel: (
              <>
                <Grid2 display={'flex'} flexDirection={'row-reverse'}>
                  <EditingToggle {...session} />
                  {state.editing ? (
                    <>
                      <SettingsToggle {...session} />
                      <ImportExportButtons {...session} />
                    </>
                  ) : (
                    <></>
                  )}
                </Grid2>
                <PlayersTable {...session} />
              </>
            ),
          },
          {
            tab: {
              label: Locale.get('Tabs.Randomizer'),
            },
            panel: (
              <>
                <Randomizer {...session} />
              </>
            ),
          },
        ]}
      />
    </main>
  );
};
