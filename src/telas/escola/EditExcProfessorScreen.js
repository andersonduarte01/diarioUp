import React, { useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Appbar, Card, TextInput, Button, useTheme, Portal, Modal, Text } from 'react-native-paper';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';
import { SuccessModal, ErrorModal } from '../../componentes/AppModal';

export default function EditarProfessorScreen({ route, navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);
  const { professor } = route.params;

  const [nome, setNome] = useState(professor.professor_nome);
  const [email, setEmail] = useState(professor.email);
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);

  const salvarAlteracoes = async () => {
    if (!nome || !email) return;
    setSaving(true);
    try {
      await api.put(
        `professor/api/professores/${professor.id}/`,
        { professor_nome: nome, email, password: senha || undefined },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      setModalSucessoVisible(true);
    } catch (error) {
      setModalErroVisible(true);
    }
    setSaving(false);
  };

  const excluirProfessor = async () => {
    setModalExcluirVisible(false);
    setSaving(true);
    try {
      await api.delete(`professor/api/professores/${professor.id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      navigation.goBack();
    } catch (error) {
      setModalErroVisible(true);
    }
    setSaving(false);
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content
          title="Editar Professor"
          titleStyle={{ color: '#fff', fontWeight: 'bold' }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <TextInput
            label="Nome do Professor"
            mode="outlined"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Senha"
            mode="outlined"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
          />

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 16 }} />
          ) : (
            <View style={styles.buttonsContainer}>
              <Button
                mode="contained"
                onPress={salvarAlteracoes}
                loading={saving}
                disabled={saving}
                style={[styles.button, { borderRadius: 6 }]}
              >
                Salvar
              </Button>

              <Button
                mode="contained"
                onPress={() => setModalExcluirVisible(true)}
                loading={saving}
                disabled={saving}
                style={[styles.button, { backgroundColor: theme.colors.error, borderRadius: 6 }]}
              >
                Excluir
              </Button>
            </View>
          )}
        </Card>
      </ScrollView>

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

      {/* Modal de confirmação de exclusão */}
      <Portal>
        <Modal
          visible={modalExcluirVisible}
          onDismiss={() => setModalExcluirVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={{ marginBottom: 16 }}>Tem certeza que deseja excluir este professor?</Text>
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            onPress={excluirProfessor}
            style={{ marginBottom: 8, borderRadius: 6 }}
          >
            Sim, excluir
          </Button>
          <Button
            mode="outlined"
            onPress={() => setModalExcluirVisible(false)}
            style={{ borderRadius: 6 }}
          >
            Cancelar
          </Button>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15
  },
  button: {
    flex: 1,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
});
