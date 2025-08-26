import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';
import { SuccessModal, ErrorModal } from '../../componentes/AppModal';

// Input de data com máscara
function DataInput({ value, onChangeText, ...props }) {
  const [text, setText] = useState(value || '');

  useEffect(() => {
    setText(value || '');
  }, [value]);

  const handleChange = (input) => {
    let numericValue = input.replace(/\D/g, '');
    if (numericValue.length > 8) numericValue = numericValue.slice(0, 8);

    let formatted = '';
    if (numericValue.length >= 2) {
      formatted += numericValue.slice(0, 2) + '/';
      if (numericValue.length >= 4) {
        formatted += numericValue.slice(2, 4) + '/';
        formatted += numericValue.slice(4, 8);
      } else {
        formatted += numericValue.slice(2);
      }
    } else {
      formatted = numericValue;
    }

    setText(formatted);
    if (onChangeText) onChangeText(formatted);
  };

  return (
    <TextInput
      value={text}
      onChangeText={handleChange}
      placeholder="Dia/Mês/Ano"
      keyboardType="numeric"
      style={styles.input}
      {...props}
    />
  );
}

export default function EditarExcluirAlunoScreen({ route, navigation }) {
  const { authTokens } = useContext(AuthContext);
  const { salaId, alunoId } = route.params;

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('M');
  const [loading, setLoading] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);

  useEffect(() => {
    const fetchAluno = async () => {
      setLoading(true);
      try {
        const response = await api.get(`salas/alunos_api/alunos/${salaId}/${alunoId}/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` }
        });
        setNome(response.data.nome);
        setDataNascimento(response.data.data_nascimento);
        setSexo(response.data.sexo);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do aluno.');
      }
      setLoading(false);
    };

    fetchAluno();
  }, [alunoId]);

  // Atualizar aluno
  const atualizarAluno = async () => {
    if (!nome || !dataNascimento) {
      Alert.alert('Erro', 'Informe o nome e a data de nascimento do aluno.');
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `salas/alunos_api/alunos/${salaId}/${alunoId}/`,
        { nome, data_nascimento: dataNascimento, sexo },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      setModalSucessoVisible(true);
    } catch (error) {
      setModalErroVisible(true);
    }
    setLoading(false);
  };

  // Excluir aluno
  const excluirAluno = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este aluno?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await api.delete(
                `salas/alunos_api/alunos/${salaId}/${alunoId}/`,
                { headers: { Authorization: `Bearer ${authTokens.access}` } }
              );
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o aluno.');
            }
            setLoading(false);
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do aluno"
          style={styles.input}
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <DataInput value={dataNascimento} onChangeText={setDataNascimento} />

        <Text style={styles.label}>Sexo</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sexo}
            onValueChange={(itemValue) => setSexo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Masculino" value="M" />
            <Picker.Item label="Feminino" value="F" />
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 16 }} />
        ) : (
          <>
            <TouchableOpacity style={[styles.button, styles.successButton]} onPress={atualizarAluno}>
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={excluirAluno}>
              <Text style={styles.buttonText}>Excluir Aluno</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <SuccessModal
        visible={modalSucessoVisible}
        message="Aluno atualizado com sucesso!"
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
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  label: { fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: { height: 65, width: '100%' },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  successButton: { backgroundColor: '#007AFF' },
  errorButton: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
