import React, { useState, useEffect, useContext } from "react";
import { StatusBar, ScrollView, StyleSheet } from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Card,
  Divider,
  Surface,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import api from "../../services/Api";
import { AuthContext } from "../../contexto/AuthContext";
import { SuccessModal, ErrorModal } from "../../componentes/AppModal";

export default function EditarEnderecoScreen({ navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);

  const [form, setForm] = useState({
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    const fetchEndereco = async () => {
      if (!authTokens) return;
      try {
        const response = await api.get("escola/api/meu-endereco/", {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setForm({
          rua: response.data.rua || "",
          numero: response.data.numero || "",
          complemento: response.data.complemento || "",
          bairro: response.data.bairro || "",
          cep: response.data.cep || "",
          cidade: response.data.cidade || "",
          estado: response.data.estado || "",
        });
      } catch (error) {
        setModalErroVisible(true);
      }
      setLoading(false);
    };
    fetchEndereco();
  }, [authTokens]);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("escola/api/meu-endereco/", form, {
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
      <Surface style={styles.loadingContainer}>
        <ActivityIndicator size="large" animating color={theme.colors.primary} />
      </Surface>
    );
  }

  return (
    <Surface style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.primary}
      />

      {/* AppHeader */}
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff"/>
        <Appbar.Content
          title="Editar Endereço"
          titleStyle={{ color: "#fff" }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            {[
              { key: "rua", label: "Rua", keyboardType: "default" },
              { key: "numero", label: "Número", keyboardType: "numeric" },
              { key: "complemento", label: "Complemento", keyboardType: "default" },
              { key: "bairro", label: "Bairro", keyboardType: "default" },
              { key: "cep", label: "CEP", keyboardType: "numeric" },
              { key: "cidade", label: "Cidade", keyboardType: "default" },
              { key: "estado", label: "Estado", keyboardType: "default" },
            ].map(({ key, label, keyboardType }) => (
              <TextInput
                key={key}
                mode="outlined"
                label={label}
                value={form[key]}
                onChangeText={(text) => handleChange(key, text)}
                keyboardType={keyboardType}
                style={{ marginBottom: 12 }}
              />
            ))}

            <Divider bold style={{ marginVertical: 16 }} />

            <Button
              mode="contained"
              onPress={handleSave}
              disabled={saving}
              loading={saving}
              style={{ borderRadius: 8 }}
              contentStyle={{ height: 50 }}
            >
              Salvar
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Modais */}
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
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { borderRadius: 16, paddingVertical: 8 },
});
