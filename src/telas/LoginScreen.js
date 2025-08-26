import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexto/AuthContext';

const LoginScreen = () => {
  const { login, loading, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigation.replace('Home'); // substitua 'Home' pela stack apropriada
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Preencha email e senha');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      alert('Email ou senha inválidos');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={[styles.title, { color: theme.colors.primary }]}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Entrar
        </Button>
      )}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});
