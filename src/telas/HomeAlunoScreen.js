import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeAlunoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏢 Tela Home - Aluno</Text>
    </View>
  );
};

export default HomeAlunoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
});
