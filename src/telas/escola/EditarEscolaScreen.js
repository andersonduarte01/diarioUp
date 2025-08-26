import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, View, StatusBar } from 'react-native';
import { TextInput, Button, Card, useTheme, Portal, Text, IconButton } from 'react-native-paper';
import api from '../../services/Api';
import { SuccessModal, ErrorModal } from '../../componentes/AppModal';
import { AuthContext } from '../../contexto/AuthContext';

export default function EditarEscolaScreen({ navigation, route }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);
  const { escola } = route.params;

  const [form, setForm] = useState({
    email: escola.email || '',
    telefone: escola.telefone || '',
    inep: escola.inep || '',
    cnpj: escola.cnpj || '',
  });
  const [loading, setLoading] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('escola/api/editar/minha-escola/', form, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setModalSucessoVisible(true);
    } catch (error) {
      console.log(error);
      setModalErroVisible(true);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.primary}
      />
      {/* Conteúdo */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          {[
            { key: 'email', label: 'Email', keyboardType: 'email-address' },
            { key: 'telefone', label: 'Telefone', keyboardType: 'phone-pad' },
            { key: 'inep', label: 'INEP', keyboardType: 'default' },
            { key: 'cnpj', label: 'CNPJ', keyboardType: 'numeric' },
          ].map(({ key, label, keyboardType }) => (
            <TextInput
              key={key}
              label={label}
              value={form[key]}
              onChangeText={(text) => setForm(prev => ({ ...prev, [key]: text }))}
              keyboardType={keyboardType}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  text: theme.colors.onSurface,
                  background: theme.colors.surface,
                },
              }}
            />
          ))}

          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            style={styles.button}
          >
            Salvar
          </Button>
        </Card.Content>
      </Card>

        <SuccessModal
          visible={modalSucessoVisible}
          message="Escola atualizada com sucesso!"
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
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 8,
  },
  card: { margin: 16, padding: 16, borderRadius: 12 },
  input: { marginBottom: 12 },
  button: { marginTop: 16 },
  modalContainer: { margin: 20, padding: 20, borderRadius: 12 },
});
