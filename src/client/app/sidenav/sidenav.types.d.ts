interface SidenavContentObject {
  title: string;
  items: Array<{label: string; path: string}>;
}
export interface SidenavContent extends Array<SidenavContentObject> { }


/**  Default material toggle options. */
export type MatToggle = 'open' | 'close' | 'toggle';

/** Material expansion panele toggle options. With home option to only open home. */
export type MatToggleExp = 'open' | 'close' | 'toggle' | 'home';
