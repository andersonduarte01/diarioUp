import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text, useTheme, Divider, IconButton } from 'react-native-paper';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';
import { SuccessModal, ErrorModal } from '../../componentes/AppModal';

export default function EditarEnderecoScreen({ navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
  });

  useEffect(() => {
    const fetchEndereco = async () => {
      if (!authTokens) return;
      try {
        const response = await api.get('escola/api/meu-endereco/', {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setForm({
          rua: response.data.rua || '',
          numero: response.data.numero || '',
          complemento: response.data.complemento || '',
          bairro: response.data.bairro || '',
          cep: response.data.cep || '',
          cidade: response.data.cidade || '',
          estado: response.data.estado || '',
        });
      } catch (error) {
        alert('Não foi possível carregar os dados do endereço.');
      }
      setLoading(false);
    };
    fetchEndereco();
  }, [authTokens]);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('escola/api/meu-endereco/', form, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setModalSucessoVisible(true);
    } catch (error) {
      setModalErroVisible(true);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.primary}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          {[
            { key: 'rua', label: 'Rua', keyboardType: 'default' },
            { key: 'numero', label: 'Número', keyboardType: 'numeric' },
            { key: 'complemento', label: 'Complemento', keyboardType: 'default' },
            { key: 'bairro', label: 'Bairro', keyboardType: 'default' },
            { key: 'cep', label: 'CEP', keyboardType: 'numeric' },
            { key: 'cidade', label: 'Cidade', keyboardType: 'default' },
            { key: 'estado', label: 'Estado', keyboardType: 'default' },
          ].map(({ key, label, keyboardType }) => (
            <View key={key} style={styles.item}>
              <Text style={[styles.label, { color: theme.colors.primary }]}>{label}</Text>
              <TextInput
                mode="outlined"
                value={form[key]}
                onChangeText={text => handleChange(key, text)}
                placeholder={label}
                keyboardType={keyboardType}
                style={styles.input}
                theme={{
                  colors: {
                    text: theme.colors.onSurface,
                    background: theme.colors.surface,
                  },
                }}
              />
            </View>
          ))}

          <Divider bold style={{ marginVertical: 12 }} />

          <Button
            mode="contained"
            onPress={handleSave}
            disabled={saving}
            loading={saving}
            style={styles.button}
          >
            Salvar
          </Button>
        </View>

        <SuccessModal
          visible={modalSucessoVisible}
          message="Endereço atualizado com sucesso!"
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 10,
  },
  container: { flexGrow: 1, padding: 10, alignItems: 'center' },
  card: { width: '100%', borderRadius: 15, padding: 20, elevation: 4 },
  item: { marginBottom: 8 },
  label: { fontWeight: '700', fontSize: 15, marginBottom: 6, marginLeft: 6 },
  input: { borderRadius: 8 },
  button: { marginTop: 10 },
});
