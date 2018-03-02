export interface SidenavContent {
  title: string;
  items: {
      label: string;
      path: string;
  }[];
}

/**  Default material toggle options. */
export type MatToggle = 'open' | 'close' | 'toggle';

/** Material expansion panele toggle options. With home option to only open home. */
export type MatToggleExp = 'open' | 'close' | 'toggle' | 'home';
