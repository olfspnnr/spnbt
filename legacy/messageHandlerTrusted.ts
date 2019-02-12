import { commandProps } from "../bot";

export interface messageHandleObjectTrusted {
  [key: string]: (props: commandProps) => void;
  test: () => void;
  daddy: (props: commandProps) => void;
  twitter: (props: commandProps) => void;
  help: (props: commandProps) => void;
  natalieneu: (props: commandProps) => void;
  inspire: (props: commandProps) => void;
  inspireMode: (props: commandProps) => void;
  mindful: (props: commandProps) => void;
  flachbader: (props: commandProps) => void;
  play: (props: commandProps) => void;
  add: (props: commandProps) => void;
  rigged: (props: commandProps) => void;
  pin: (props: commandProps) => void;
  wiki: (props: commandProps) => void;
  wilhelm: (props: commandProps) => void;
  "<:mist:509083062051799050>": (props: commandProps) => void;
  fault: (props: commandProps) => void;
  wisdom: (props: commandProps) => void;
}

export const helpTextTrusted = [
  "!help - Übersicht",
  "!daddy - Bildniss der Daddygames",
  "!natalieneu - neuster Tweet",
  '!twitter "hashtag" - holt sich die 5 neusten Tweets zum Hashtag',
  "!inspire - Zufällige KI generierter Quote",
  "!inspireMode - Zufällige KI generierter Quote; alle 2 Minuten",
  "!mindful - Zufällige KI generierte Mindful Session",
  "!flachbader - Flachbader Song => !stop um zu beenden",
  "!play url - Spielt Youtube URL ab => !stop um zu beenden",
  "!add url - Fügt Sound zu Playlist hinzu",
  '!pin "message" user - Pinnt die Nachricht mit dem Aktuellen Datum an',
  '!wiki searchterm - Gibt eine Auswahl für den Begriff zurück => Nummer => "!link" eintippen wenn link gewünscht',
  "!wilhelm - spielt einen Willhelm Schrei ab",
  ":mist: - spielt Mist Sound ab",
  "!fault - ",
  "!widsom - präsentiert eine Weißheit von einem LovooUser."
].join("\r");
