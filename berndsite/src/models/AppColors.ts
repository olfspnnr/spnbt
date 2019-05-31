export interface AppColors {
  [key: string]: tailwindColors;
  primary: tailwindColors;
  secondary: tailwindColors;
  tertiary: tailwindColors;
  textOnColor: tailwindColors;
  textDefault: tailwindColors;
  textHighlight: tailwindColors;
}

export type tailwindColors =
  | "black"
  | "white"
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";
export type tailwindColorIntensity = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "";
