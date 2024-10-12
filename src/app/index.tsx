import React from 'react';
import './index.css';
import Alert from '@mui/material/Alert';
import type { AlertMessage, Session } from '../types';
import { Manager } from './manager';
import { PlayersTable } from './players';
import { ImportExportButtons } from './importexport';
import { copyToClipboard } from './utils';

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
  React.useEffect(() => {
    if (!message || message.timeout === undefined) return;
    const handle = setTimeout(() => setMessage(undefined), message?.timeout ?? 0);
    return () => handle && clearTimeout(handle);
  }, [message]);
  return (
    <main>
      <h1>Genshin Randomizer</h1>
      {message && (
        <Alert severity={message.type} onClose={message.noCloseButton ? undefined : () => setMessage(undefined)}>
          {message.text}
          {message.copyableData && message.copyableData.length ? (
            <code
              style={{ display: 'block', cursor: 'pointer' }}
              onClick={() => copyToClipboard(message.copyableData).then((o) => o === true && setMessage(undefined))}>
              {message.copyableData}
            </code>
          ) : (
            <></>
          )}
        </Alert>
      )}
      <PlayersTable {...session} />
      <div style={{ float: 'right' }}>
        <ImportExportButtons {...session} />
      </div>
    </main>
  );
}
