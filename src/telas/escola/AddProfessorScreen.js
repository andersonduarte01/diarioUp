import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
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
      await api.post(
        'professor/api/professores/',
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
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Cadastrar Professor</Text>

          <TextInput
            label="Nome do Professor"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
            contentStyle={{ paddingVertical: 4 }}
            outlineColor="#d6d3d3"
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            contentStyle={{ paddingVertical: 4 }}
            outlineColor="#d6d3d3"
          />

          <TextInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            contentStyle={{ paddingVertical: 4 }}
            outlineColor="#d6d3d3"
          />

          {loading ? (
            <ActivityIndicator
              animating={true}
              color="#007AFF"
              size="large"
              style={{ marginTop: 16 }}
            />
          ) : (
            <Button
              mode="contained"
              onPress={salvarProfessor}
              style={styles.button}
            >
              Cadastrar
            </Button>
          )}
        </Card.Content>
      </Card>

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
    borderRadius: 12,
    padding: 1,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007AFF',
  },
  input: {
    marginTop: 8,
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
});
