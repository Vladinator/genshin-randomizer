const DefaultLanguage = {
  GenshinRandomizer: 'Genshin Randomizer',
  ImportExport: {
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
    Delete: 'Delete',
    Exclude: 'Exclude',
    Include: 'Include',
    Add: 'Add',
    Players: 'Players',
    AddCharacterToTeam: 'Add character to team {}',
    DeletePlayer: 'Delete player',
    NewPlayer: 'New player',
  },
} as const;

export default DefaultLanguage;
