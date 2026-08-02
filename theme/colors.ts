export type ThemeColors = {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryPressed: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  overlay: string;
};

export const lightColors: ThemeColors = {
  background: '#F8F8F6',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#171714',
  textMuted: '#686861',
  primary: '#5B4BDB',
  primaryPressed: '#4637B9',
  border: '#E5E4DF',
  success: '#18794E',
  warning: '#A15C00',
  danger: '#C62F3A',
  overlay: 'rgba(23, 23, 20, 0.48)',
};

export const darkColors: ThemeColors = {
  background: '#11110F',
  surface: '#1B1B18',
  surfaceElevated: '#252521',
  text: '#F5F5F2',
  textMuted: '#ADADA5',
  primary: '#A99EFF',
  primaryPressed: '#C1B9FF',
  border: '#35352F',
  success: '#59C794',
  warning: '#F0AD4E',
  danger: '#FF7A84',
  overlay: 'rgba(0, 0, 0, 0.68)',
};
