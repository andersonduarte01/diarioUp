import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../src/contexto/AuthContext';

const LoginScreen = () => {
  const { login, loading, user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigation.replace('Home');
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha email e senha');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      Alert.alert('Erro', 'Email ou senha inválidos');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#E3F9FF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Card principal */}
        <View style={styles.card}>
          {/* Avatar circular sobre o card */}
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../imagens/monitor.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          {/* Título */}
          <Text style={styles.title}>Bem-vindo!</Text>

          {/* Inputs */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#777"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#777"
          />

          {/* Botão */}
          {loading ? (
            <ActivityIndicator size="large" color="#0D47A1" style={{ marginTop: 20 }} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2885d1ff',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 120, // espaço para avatar
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    position: 'relative',
  },
  avatarContainer: {
    width: 210,
    height: 210,
    borderRadius: 140,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#0D47A1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: 220,
    height: 220,
    borderRadius: 65,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    backgroundColor: '#0D47A1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});