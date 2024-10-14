import React from 'react';
import { Button, Grid2, Typography } from '@mui/material';
import { SettingsIcon } from './index';
import type { Session } from '../../types';
import { Locale } from '../../locale';
import { Storage } from '../storage';
import { Modal } from './modal';
import { SettingsList } from './settingslist';
import { AppTabs } from './apptabs';

export const SettingsToggle: React.FC<Session> = (props): JSX.Element => {
  const { manager, randomizer, updateManager } = props;
  return (
    <Modal //
      dialogTitle={Locale.get('Settings.Settings')}
      buttonText={Locale.get('Settings.Settings')}
      buttonIcon={<SettingsIcon />}>
      <AppTabs
        tabs={[
          {
            tab: {
              label: Locale.get('Settings.Bosses'),
            },
            panel: (
              <SettingsList
                {...props}
                items={manager.getBosses()}
                onRemove={(item) => {
                  if (!window.confirm(Locale.get('Confirm.Delete', item.name))) return;
                  manager.removeBoss(item);
                }}
                onAdd={() => manager.addBoss('')}
              />
            ),
          },
          {
            tab: {
              label: Locale.get('Settings.Characters'),
            },
            panel: (
              <SettingsList
                {...props}
                items={manager.getCharacters()}
                onRemove={(item) => {
                  if (!window.confirm(Locale.get('Confirm.Delete', item.name))) return;
                  manager.removeCharacter(item);
                }}
                onAdd={() => manager.addCharacter('')}
              />
            ),
          },
          {
            tab: {
              label: Locale.get('Settings.Utilities'),
            },
            panel: (
              <Grid2 container spacing={2} flexDirection={'column'}>
                <Button
                  variant='contained'
                  onClick={() => {
                    const sortByName = <T extends { name: string }>(a: T, b: T): number => {
                      return a.name.localeCompare(b.name);
                    };
                    manager.getBosses().sort(sortByName);
                    manager.getCharacters().sort(sortByName);
                    manager.getTeams().forEach((team) => team.characters.sort(sortByName));
                    manager.getTeams().sort((a, b) => a.player.name.localeCompare(b.player.name));
                    updateManager();
                  }}>
                  {Locale.get('Settings.SortAlphabetically')}
                </Button>
                <Typography variant='h6'>{Locale.get('Settings.Reset')}</Typography>
                <Button
                  color='error'
                  variant='outlined'
                  onClick={() => {
                    if (!window.confirm(Locale.get('Settings.ConfirmPurgeSettingsCache'))) return;
                    Storage.clearSettings();
                    manager.load();
                    randomizer.clearOutcomes();
                    updateManager();
                  }}>
                  {Locale.get('Settings.PurgeSettingsCache')}
                </Button>
                <Button
                  color='error'
                  variant='outlined'
                  onClick={() => {
                    if (!window.confirm(Locale.get('Settings.ConfirmPurgeBossCache'))) return;
                    Storage.clearBosses();
                    manager.load();
                    randomizer.clearOutcomes();
                    updateManager();
                  }}>
                  {Locale.get('Settings.PurgeBossCache')}
                </Button>
                <Button
                  color='error'
                  variant='outlined'
                  onClick={() => {
                    if (!window.confirm(Locale.get('Settings.ConfirmPurgeCharacterCache'))) return;
                    Storage.clearCharacters();
                    manager.load();
                    randomizer.clearOutcomes();
                    updateManager();
                  }}>
                  {Locale.get('Settings.PurgeCharacterCache')}
                </Button>
                <Button
                  color='error'
                  variant='outlined'
                  onClick={() => {
                    if (!window.confirm(Locale.get('Settings.ConfirmPurgePlayerCache'))) return;
                    Storage.clearTeams();
                    manager.load();
                    randomizer.clearOutcomes();
                    updateManager();
                  }}>
                  {Locale.get('Settings.PurgePlayerCache')}
                </Button>
                <Button
                  color='error'
                  variant='contained'
                  onClick={() => {
                    if (!window.confirm(Locale.get('Settings.ConfirmPurgeAllCache'))) return;
                    Storage.clearAll();
                    manager.load();
                    randomizer.clearOutcomes();
                    updateManager();
                  }}>
                  {Locale.get('Settings.PurgeAllCache')}
                </Button>
              </Grid2>
            ),
          },
        ]}
      />
    </Modal>
  );
};
