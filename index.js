import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import AppWithProvider from './App';

AppRegistry.registerComponent(appName, () => AppWithProvider);
