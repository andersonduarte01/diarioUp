import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, List } from 'react-native-paper';

export default function ProConfiguracoesScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Item
          title="Tema"
          description="Professor usando o tema primário do Paper"
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
