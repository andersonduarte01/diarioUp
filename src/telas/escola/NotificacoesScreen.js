import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificacoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notificações</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
  text: { fontSize: 18, fontWeight: '600' },
});
