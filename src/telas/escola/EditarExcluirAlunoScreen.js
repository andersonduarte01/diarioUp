import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Appbar, Card, TextInput, Button, useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import api from "../../services/Api";
import { AuthContext } from "../../contexto/AuthContext";
import { SuccessModal, ErrorModal } from "../../componentes/AppModal";

// Input de data com máscara
function DataInput({ value, onChangeText }) {
  const [text, setText] = useState(value || "");

  useEffect(() => {
    setText(value || "");
  }, [value]);

  const handleChange = (input) => {
    let numericValue = input.replace(/\D/g, "");
    if (numericValue.length > 8) numericValue = numericValue.slice(0, 8);

    let formatted = "";
    if (numericValue.length >= 2) {
      formatted += numericValue.slice(0, 2) + "/";
      if (numericValue.length >= 4) {
        formatted += numericValue.slice(2, 4) + "/";
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
      mode="outlined"
      label="Data de Nascimento"
      value={text}
      onChangeText={handleChange}
      keyboardType="numeric"
      style={styles.input}
      placeholder="Dia/Mês/Ano"
    />
  );
}

export default function EditarExcluirAlunoScreen({ route, navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);
  const { salaId, alunoId } = route.params;

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("M");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const response = await api.get(
          `salas/alunos_api/alunos/${salaId}/${alunoId}/`,
          { headers: { Authorization: `Bearer ${authTokens.access}` } }
        );
        setNome(response.data.nome);
        setDataNascimento(response.data.data_nascimento);
        setSexo(response.data.sexo);
      } catch (error) {
        setModalErroVisible(true);
      }
      setLoading(false);
    };
    fetchAluno();
  }, [alunoId]);

  const atualizarAluno = async () => {
    if (!nome || !dataNascimento) return;
    setSaving(true);
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
    setSaving(false);
  };

  const confirmarExcluir = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este aluno?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: excluirAluno }
      ]
    );
  };

  const excluirAluno = async () => {
    setSaving(true);
    try {
      await api.delete(
        `salas/alunos_api/alunos/${salaId}/${alunoId}/`,
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      navigation.goBack();
    } catch (error) {
      setModalErroVisible(true);
    }
    setSaving(false);
  };

  return (
    <>
      {/* AppHeader */}
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content
          title="Editar Aluno"
          titleStyle={{ color: "#fff" }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <Card style={styles.card}>
            <TextInput
              mode="outlined"
              label="Nome"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
            />

            <DataInput value={dataNascimento} onChangeText={setDataNascimento} />

            <Card style={styles.pickerCard}>
              <Picker
                selectedValue={sexo}
                onValueChange={(itemValue) => setSexo(itemValue)}
                style={{ height: 55, width: "100%" }}
              >
                <Picker.Item label="Masculino" value="M" />
                <Picker.Item label="Feminino" value="F" />
              </Picker>
            </Card>

            <View style={styles.buttonsContainer}>
              <Button
                mode="contained"
                onPress={atualizarAluno}
                loading={saving}
                disabled={saving}
                style={[styles.button, styles.buttonMarginRight, { borderRadius: 6 }]}
              >
                Salvar
              </Button>
              <Button
                mode="contained"
                onPress={confirmarExcluir}
                loading={saving}
                disabled={saving}
                style={[styles.button, { backgroundColor: theme.colors.error, borderRadius: 6 }]}
              >
                Excluir
              </Button>
            </View>
          </Card>
        )}
      </ScrollView>

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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  pickerCard: {
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
  },
  buttonMarginRight: {
    marginRight: 8,
  },
});
