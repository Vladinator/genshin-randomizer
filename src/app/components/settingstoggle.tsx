import React from 'react';
import { Button } from '@mui/material';
import { SettingsIcon } from './index';
import type { Session } from '../../types';
import { Locale } from '../../locale';
import { Modal } from './modal';
import { SettingsList } from './settingslist';
import { AppTabs } from './apptabs';

export const SettingsToggle: React.FC<Session> = (props): JSX.Element => {
  const { manager, updateManager } = props;
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
              <>
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
              </>
            ),
          },
        ]}
      />
    </Modal>
  );
};
