import React from 'react';
import { type TabProps, Box, Tab, Tabs } from '@mui/material';

type AppTab = {
  tab: TabProps & { label: string };
  panel: JSX.Element;
};

interface AppTabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}

const AppTabPanel = (props: AppTabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`app-tabpanel-${index}`}
      aria-labelledby={`app-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const AppTabs: React.FC<{ tabs: AppTab[] }> = ({ tabs }): JSX.Element => {
  const [tabIndex, setTabIndex] = React.useState(0);
  if (!tabs.length) {
    return <></>;
  }
  if (tabs.length === 1) {
    return tabs[0].panel;
  }
  const onTabChange = (event: React.SyntheticEvent, newTab: number) => {
    if (tabs[newTab]) {
      setTabIndex(newTab);
    }
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          //
          value={tabIndex}
          onChange={onTabChange}
          aria-label='app tabs'>
          {tabs.map((o, i) => (
            <Tab {...o.tab} key={o.tab.key ?? o.tab.label} id={`app-tab-${i}`} aria-controls={`app-tabpanel-${i}`} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((o, i) => (
        <AppTabPanel key={o.tab.key ?? o.tab.label} value={tabIndex} index={i}>
          {o.panel}
        </AppTabPanel>
      ))}
    </Box>
  );
};
