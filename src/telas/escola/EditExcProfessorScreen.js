import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';
import { SuccessModal, ErrorModal } from '../../componentes/AppModal';

export default function EditarProfessorScreen({ route, navigation }) {
  const { authTokens } = useContext(AuthContext);
  const { professor } = route.params; // Recebe o professor da lista

  const [nome, setNome] = useState(professor.professor_nome);
  const [email, setEmail] = useState(professor.email);
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);

  const salvarAlteracoes = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Preencha nome e email.');
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `professor/api/professores/${professor.id}/`,
        { professor_nome: nome, email, password: senha || undefined },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      setModalSucessoVisible(true);
    } catch (error) {
      console.log('Erro ao atualizar professor:', error.response || error);
      setModalErroVisible(true);
    }
    setLoading(false);
  };

  const excluirProfessor = async () => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir este professor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.delete(`professor/api/professores/${professor.id}/`, {
                headers: { Authorization: `Bearer ${authTokens.access}` },
              });
              setLoading(false);
              navigation.goBack();
            } catch (error) {
              console.log('Erro ao excluir professor:', error.response || error);
              setModalErroVisible(true);
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Editar Professor</Text>

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
          placeholder="Digite nova senha"
          secureTextEntry
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 16 }} />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
              <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={excluirProfessor}>
              <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <SuccessModal
        visible={modalSucessoVisible}
        message="Professor atualizado com sucesso!"
        onClose={() => {
            setModalSucessoVisible(false);
            navigation.goBack();
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
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
