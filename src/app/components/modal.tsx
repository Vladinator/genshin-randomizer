import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export type ModalProps = {
  buttonText: string;
  buttonIcon?: JSX.Element;
  buttonVariant?: 'text' | 'outlined' | 'contained';
  dialogTitle?: string;
  open?: boolean;
  onClose?: () => void;
  children?: string | JSX.Element | JSX.Element[];
};

export const Modal: React.FC<ModalProps> = ({
  buttonText,
  buttonIcon,
  buttonVariant,
  dialogTitle,
  open,
  onClose,
  children,
}): JSX.Element => {
  const [isOpen, setOpen] = React.useState(!!open);
  return (
    <>
      <Button variant={buttonVariant ?? 'text'} onClick={() => setOpen(true)}>
        {buttonIcon}
        {buttonText}
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => {
          setOpen(false);
          onClose && onClose();
        }}
        fullWidth={true}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        {children}
      </Dialog>
    </>
  );
};
