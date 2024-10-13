const DefaultLanguage = {
  GenshinRandomizer: 'Genshin Randomizer',
  Tabs: {
    Players: 'Players',
    Randomizer: 'Randomizer',
  },
  ImportExport: {
    Export: 'Export',
    Import: 'Import',
    ExportClipboardError: `Import string couldn't be stored in your clipboard. Something went wrong!`,
    ExportClipboardSuccess: 'Import string stored in clipboard. Paste it somewhere safe!',
    ImportPasteHere: 'Paste import string here:',
    ImportError: 'Unable to load what you pasted. Did you copy the entire import string?',
    ImportSuccess: 'Loaded!',
  },
  Settings: {
    Settings: 'Settings',
    Bosses: 'Bosses',
    Characters: 'Characters',
  },
  Players: {
    Edit: 'Edit',
    Delete: 'Delete',
    Exclude: 'Exclude',
    Include: 'Include',
    Add: 'Add',
    Players: 'Players',
    AddCharacterToTeam: 'Add character to team {}',
    DeletePlayer: 'Delete player',
    NewPlayer: 'New player',
  },
  Randomize: {
    Randomize: 'Randomize',
    Lock: 'Lock',
    Unlock: 'Unlock',
  },
  Confirm: {
    Delete: 'Are you sure you want to delete {}?',
  },
} as const;

export default DefaultLanguage;
