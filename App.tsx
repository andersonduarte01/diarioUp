import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { AuthProvider } from './src/contexto/AuthContext';
import Routes from './src/routes/Routes';
import { lightTheme } from './src/componentes/Temas';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <AuthProvider>
          <SafeAreaView style={styles.safeArea}>
            <Routes />
          </SafeAreaView>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
});
