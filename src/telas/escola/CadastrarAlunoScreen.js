import React, { useState, useContext } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { TextInput, Button, Card, Appbar, useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import api from "../../services/Api";
import { AuthContext } from "../../contexto/AuthContext";
import { SuccessModal, ErrorModal } from "../../componentes/AppModal";

// Componente de input de data com máscara
function DataInput({ value, onChangeText, theme, ...props }) {
  const [text, setText] = useState(value || "");

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
      label="Data de Nascimento"
      value={text}
      onChangeText={handleChange}
      mode="outlined"
      style={{ marginBottom: 16 }}
      outlineColor="#ccc"
      activeOutlineColor={theme.colors.primary}
      placeholder="Dia/Mês/Ano"
      placeholderTextColor="#999"
      keyboardType="numeric"
      {...props}
    />
  );
}

export default function CadastrarAlunoScreen({ route, navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);
  const { salaId } = route.params;

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("M");
  const [loading, setLoading] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);

  const salvarAluno = async () => {
    if (!nome || !dataNascimento) {
      Alert.alert("Erro", "Informe o nome e a data de nascimento do aluno.");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        `salas/alunos_api/alunos/${salaId}/`,
        { nome, data_nascimento: dataNascimento, sexo },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      setModalSucessoVisible(true);
    } catch (error) {
      setModalErroVisible(true);
    }
    setLoading(false);
  };

  return (
    <>
      {/* AppHeader azul */}
      <Appbar.Header style={{ backgroundColor: "#0D6EFD" }}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Cadastrar Aluno"
          titleStyle={{ color: "#fff" }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Nome"
              value={nome}
              onChangeText={setNome}
              mode="outlined"
              style={styles.input}
              outlineColor="#ccc"
              activeOutlineColor={theme.colors.primary}
              placeholder="Digite o nome"
              placeholderTextColor="#999"
            />

            <DataInput
              value={dataNascimento}
              onChangeText={setDataNascimento}
              theme={theme}
            />

            {/* Picker direto para sexo */}
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
              <ActivityIndicator
                size="large"
                color={theme.colors.primary}
                style={{ marginTop: 16 }}
              />
            ) : (
              <Button
                mode="contained"
                onPress={salvarAluno}
                style={styles.button}
                contentStyle={{ height: 50 }}
              >
                Salvar
              </Button>
            )}
          </Card.Content>
        </Card>

        <SuccessModal
          visible={modalSucessoVisible}
          message="Aluno cadastrado com sucesso!"
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
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: "#f5f5f5" },
  card: { borderRadius: 12, padding: 16, elevation: 4, marginTop: 16 },
  input: { marginBottom: 16, backgroundColor: "#fff" },
  pickerContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 55,
    width: "100%",
  },
  button: { marginTop: 8, borderRadius: 8 },
});
