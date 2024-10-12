import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import type { Session } from '../../types';
import { Locale } from '../../locale';
import { Modal } from './modal';
import { SettingsList } from './settingslist';

export const SettingsToggle: React.FC<Session> = (props): JSX.Element => {
  const { manager } = props;
  return (
    <Modal //
      dialogTitle={Locale.get('Settings.Settings')}
      buttonText={Locale.get('Settings.Settings')}
      buttonIcon={<SettingsIcon />}>
      <SettingsList
        //
        {...props}
        header={Locale.get('Settings.Bosses')}
        items={manager.getBosses()}
        onRemove={(item) => manager.removeBoss(item)}
        onAdd={() => manager.addBoss('')}
      />
      <SettingsList
        //
        {...props}
        header={Locale.get('Settings.Characters')}
        items={manager.getCharacters()}
        onRemove={(item) => manager.removeCharacter(item)}
        onAdd={() => manager.addCharacter('')}
      />
    </Modal>
  );
};
