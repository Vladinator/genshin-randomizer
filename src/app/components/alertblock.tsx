import React from 'react';
import Alert from '@mui/material/Alert';
import type { AlertMessage } from '../../types';
import { Typography } from '@mui/material';

const floating: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  paddingTop: 15,
  paddingBottom: 15,
};

export const AlertBlock: React.FC<{ fixed?: boolean; message: AlertMessage; onClose: () => void }> = ({
  fixed,
  message,
  onClose,
}): JSX.Element => {
  const { text, type, timeout, noCloseButton } = message;
  React.useEffect(() => {
    if (timeout === undefined) return;
    const handle = setTimeout(onClose, timeout);
    return () => handle && clearTimeout(handle);
  }, [timeout, onClose]);
  return (
    <Alert //
      severity={type}
      onClose={noCloseButton ? undefined : onClose}
      style={fixed !== false ? floating : undefined}>
      <Typography>{text}</Typography>
    </Alert>
  );
};
