import React, { useState, useContext } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';
import { SuccessModal, ErrorModal } from '../../componentes/AppModal';

export default function CadastrarProfessorScreen({ navigation }) {
  const { authTokens } = useContext(AuthContext);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);

  const salvarProfessor = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await api.post('professor/api/professores/',
        { professor_nome: nome, email, password: senha },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      setModalSucessoVisible(true);
      setNome('');
      setEmail('');
      setSenha('');
    } catch (error) {
      console.log('Erro ao cadastrar professor:', error.response || error);
      setModalErroVisible(true);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cadastrar Professor</Text>

        <Text style={styles.label}>Nome do Professor</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome"
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite a senha"
          secureTextEntry
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 16 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={salvarProfessor}>
            <Ionicons name="person-add-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        )}
      </View>

      <SuccessModal
        visible={modalSucessoVisible}
        message="Professor cadastrado com sucesso!"
        onClose={() => {
          setModalSucessoVisible(false);
          navigation.navigate('Professores'); 
        }}
      />

      <ErrorModal
        visible={modalErroVisible}
        message="Ocorreu um erro. Tente novamente."
        onClose={() => setModalErroVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007AFF',
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
