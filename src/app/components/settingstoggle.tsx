import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import type { Session } from '../../types';
import { Locale } from '../../locale';
import { Modal } from './modal';
import { SettingsList } from './settingslist';
import { AppTabs } from './apptabs';

export const SettingsToggle: React.FC<Session> = (props): JSX.Element => {
  const { manager } = props;
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
        ]}
      />
    </Modal>
  );
};
