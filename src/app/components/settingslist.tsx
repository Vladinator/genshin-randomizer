import React from 'react';
import { Box, Grid2, IconButton, List, ListItem, TextField } from '@mui/material';
import { AddIcon, RemoveIcon, ToggleOffIcon, ToggleOnIcon } from './index';
import type { Session, ToggleBoss, ToggleCharacter } from '../../types';
import { Locale } from '../../locale';

type SettingsListProps<T = ToggleBoss | ToggleCharacter> = Session & {
  header?: string;
  items: T[];
  showToggle?: boolean;
  showRemove?: boolean;
  showAdd?: boolean;
  onToggle?: (item: T) => void;
  onRemove?: (item: T) => void;
  onChange?: (item: T) => void;
  onAdd?: () => void;
};

export const SettingsList: React.FC<SettingsListProps> = ({
  updateManager,
  header,
  items,
  showToggle,
  showRemove,
  showAdd,
  onToggle,
  onRemove,
  onChange,
  onAdd,
}): JSX.Element => {
  return (
    <Box>
      <Grid2 container={true} direction={'column'}>
        {header && <div style={{ paddingLeft: 15 }}>{header}</div>}
        <List dense={true}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              dense={true}
              secondaryAction={
                <>
                  {showToggle !== false && (
                    <IconButton
                      edge='end'
                      aria-label={`${Locale.get('Players.Delete')} ${item.name}`}
                      onClick={() => {
                        item.ignore = !item.ignore;
                        if (onToggle) {
                          onToggle(item);
                        }
                        updateManager();
                      }}>
                      {item.ignore ? <ToggleOffIcon /> : <ToggleOnIcon />}
                    </IconButton>
                  )}
                  {showRemove !== false && (
                    <IconButton
                      edge='end'
                      aria-label={`${item.ignore ? Locale.get('Players.Include') : Locale.get('Players.Exclude')} ${item.name}`}
                      onClick={() => {
                        if (onRemove) {
                          onRemove(item);
                        }
                        updateManager();
                      }}
                      color='error'>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </>
              }>
              <TextField
                value={item.name}
                onChange={(e) => {
                  item.name = e.target.value;
                  if (onChange) {
                    onChange(item);
                  }
                  updateManager();
                }}
                size='small'
                fullWidth={true}
                style={{ marginRight: 25 }}
              />
            </ListItem>
          ))}
          {showAdd !== false ? (
            <ListItem dense={true}>
              <IconButton
                aria-label={Locale.get('Players.Add')}
                onClick={() => {
                  if (onAdd) {
                    onAdd();
                  }
                  updateManager();
                }}
                color='success'>
                <AddIcon />
              </IconButton>
            </ListItem>
          ) : (
            <></>
          )}
        </List>
      </Grid2>
    </Box>
  );
};
