import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1E88E5',
    onPrimary: '#FFFFFF',
    background: '#F5F5F5',
    onBackground: '#333333',
    surface: '#FFFFFF',
    onSurface: '#000000',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    onPrimary: '#000000',
    background: '#121212',
    onBackground: '#FFFFFF',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
  },
};
