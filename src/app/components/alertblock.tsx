import React from 'react';
import Alert from '@mui/material/Alert';
import type { AlertMessage } from '../../types';
import { copyToClipboard } from '../utils';

export const AlertBlock: React.FC<{ message: AlertMessage; onClose: () => void }> = ({
  message,
  onClose,
}): JSX.Element => {
  const { text, type, timeout, noCloseButton, copyableData } = message;
  React.useEffect(() => {
    if (timeout === undefined) return;
    const handle = setTimeout(onClose, timeout);
    return () => handle && clearTimeout(handle);
  }, [timeout, onClose]);
  return (
    <Alert
      //
      severity={type}
      onClose={noCloseButton ? undefined : onClose}>
      {text}
      {copyableData && copyableData.length ? (
        <code
          style={{ display: 'block', cursor: 'pointer' }}
          onClick={() => copyToClipboard(message.copyableData).then((o) => o === true && onClose())}>
          {message.copyableData}
        </code>
      ) : (
        <></>
      )}
    </Alert>
  );
};
