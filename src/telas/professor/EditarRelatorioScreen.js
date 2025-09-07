import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Appbar, Text, TextInput, Button, ActivityIndicator, Card } from "react-native-paper";
import { AuthContext } from "../../contexto/AuthContext";
import api from "../../services/Api";
import { SuccessModal, ErrorModal } from "../../componentes/AppModal";

export default function RelatorioUpdate() {
  const navigation = useNavigation();
  const route = useRoute();
  const { authTokens } = useContext(AuthContext);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);
  const { relatorio, aluno, periodo, sala } = route.params;
  const [textoRelatorio, setTextoRelatorio] = useState(relatorio.relatorio);
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!textoRelatorio.trim()) {
      Alert.alert("Erro", "O relatório não pode estar vazio.");
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `frequencia/api/relatorios/${relatorio.id}/`,
        { relatorio: textoRelatorio },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      setModalSucessoVisible(true);
    } catch (error) {
      console.log(error);
      setModalErroVisible(true);
    }
    setLoading(false);
  };

  // Função para formatar o período
  const formatarPeriodo = (p) => {
    switch (p) {
      case 1: return "1º Bimestre";
      case 2: return "2º Bimestre";
      case 3: return "3º Bimestre";
      case 4: return "4º Bimestre";
      default: return `${p}`;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: "#1E88E5" }}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title={"Editar Relatório - " + formatarPeriodo(periodo)} titleStyle={{ color: "#fff", fontSize: 22 }} />
      </Appbar.Header>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="labelLarge" style={styles.label}>{aluno.nome}</Text>
            <TextInput
              mode="outlined"
              label="Relatório"
              value={textoRelatorio}
              onChangeText={setTextoRelatorio}
              multiline
              style={styles.textInput}
              outlineColor="#ccc"
              activeOutlineColor="#1E88E5"
            />

            <Button
              mode="contained"
              onPress={handleSalvar}
              style={styles.button}
              disabled={loading}
              buttonColor="#1E88E5"
            >
              {loading ? (
                <ActivityIndicator animating color="#fff" />
              ) : (
                "Salvar"
              )}
            </Button>
          </Card.Content>
        </Card>
      </View>
      <SuccessModal
        visible={modalSucessoVisible}
        message="Relatório atualizado com sucesso!"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  content: { flex: 1, padding: 16 },
  card: {
    borderRadius: 12,
    elevation: 3,
    paddingVertical: 4
  },
  label: { 
    fontSize: 20,
    marginBottom: 1, 
    color: "#007AFF",
    marginLeft: 10,
    textAlign: "center" 
  },
  value: { fontWeight: "normal", color: "#333" },
  textInput: {
    marginTop: 12,
    marginBottom: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    minHeight: 160
  },
  button: {
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8
  }
});
