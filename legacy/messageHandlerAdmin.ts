import { commandProps } from "../bot";

export interface messageHandleObjectAdmin {
  [key: string]: (prop: commandProps) => void;
  help: (prop: commandProps) => void;
  leavevoice: (prop: commandProps) => void;
  joinvoice: (prop: commandProps) => void;
  knock: (prop: commandProps) => void;
  cheer: (prop: commandProps) => void;
  playLoud: (prop: commandProps) => void;
  clearFails: (prop: commandProps) => void;
  moveAndKeep: (prop: commandProps) => void;
  test: (prop: commandProps) => void;
  poop: (prop: commandProps) => void;
  renameUser: (prop: commandProps) => void;
  getLovooAmount: (prop: commandProps) => void;
  bulkDelete: (prop: commandProps) => void;
}

export const helpTextSpinner = [
  "!help - Übersicht",
  "!leavevoice - lässt den Bot den VoiceChannel verlassen",
  "!joinvoice - lässt den Bot den VoiceChannel beitreten",
  "!knock - spielt Klopfgeräusch ab",
  "!cheer - spielt weiblichen Jubel ab",
  "!playLoud - gleich wie !play, nur laut",
  "!clearFails - löscht alle gefailten commands",
  "!moveAndKeep  - Moved einen User in die Stille Treppe und behält ihn dort",
  "!test - zum testen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  "!poop - weist eine Person der Poopgruppe zu",
  "!renameUser - nennt User um zu angegebenen Namen / toggle ob dies automatisch passieren soll - !renameUser @[user] [nickname]",
  "!getLovooAmount - gibt die Anzahl der Lovoo-User im 'Speicher' zurück.",
  "!bulkDelete - filtert die letzten 25 Nachrichten nach der ID und löscht diese (Außer gepinnte Nachrichten) - !bulkDelte @[user] ?[anzahl]"
].join("\r");
