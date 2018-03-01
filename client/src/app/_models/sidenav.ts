export interface SidenavContent {
  title: string;
  items: {
      label: string;
      path: string;
  }[];
}

// Material toggle options
export type MatToggle = 'open' | 'close' | 'toggle' | 'home';
