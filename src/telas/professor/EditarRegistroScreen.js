import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import {
  Appbar,
  Card,
  Text,
  TextInput,
  Divider,
  Button,
} from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../contexto/AuthContext";
import { SuccessModal, ErrorModal } from "../../componentes/AppModal";
import api from "../../services/Api";

export default function EditarRegistro({ route }) {
  const { registroId } = route.params;
  const navigation = useNavigation();
  const { authTokens } = useContext(AuthContext);

  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);
  const [registro, setRegistro] = useState(null);

  const fetchRegistro = async () => {
    if (!authTokens) return;
    try {
      const response = await api.get(`frequencia/api/registros/${registroId}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setRegistro(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar o registro.");
    }
  };

  useEffect(() => {
    fetchRegistro();
  }, [authTokens]);

  const salvarRegistro = async () => {
    if (!authTokens) return;
    try {
      await api.put(`frequencia/api/registros/${registroId}/`, registro, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setModalSucessoVisible(true);
    } catch (error) {
      setModalErroVisible(true);
    }
  };

  const excluirRegistro = () => {
    Alert.alert("Confirmação", "Deseja realmente excluir este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`frequencia/api/registros/${registroId}/`, {
              headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            Alert.alert("Sucesso", "Registro excluído com sucesso.");
            navigation.goBack();
          } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível excluir o registro.");
          }
        },
      },
    ]);
  };

  if (!registro) return <Text style={{ padding: 16 }}>Carregando...</Text>;

  const dataInicio = registro.data
    ? format(new Date(registro.data), "dd/MM/yyyy")
    : "";
  const dataFim = registro.data_fim
    ? format(new Date(registro.data_fim), "dd/MM/yyyy")
    : "";

  return (
    <View style={styles.container}>
      {/* App Header */}
      <Appbar.Header style={{ backgroundColor: "#1E88E5" }}>
        <Appbar.Action
          icon={() => <Icon name="arrow-back" size={24} color="#fff" />}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Editar Registro"
          titleStyle={{ color: "#fff" }}
        />
      </Appbar.Header>

      {/* Conteúdo */}
      <ScrollView style={styles.scrollContainer}>
        <Card style={styles.card}>
          <Text variant="titleLarge" style={styles.sublabel}>Registro</Text>
          <Text style={styles.textoDatas}>
            {dataInicio} {dataFim ? `à ${dataFim}` : ""}
          </Text>

          <Divider style={{ marginVertical: 10 }} />

          <TextInput
            label="Práticas que possibilitam"
            mode="outlined"
            style={styles.textarea}
            multiline
            value={registro.pratica}
            onChangeText={(text) =>
              setRegistro({ ...registro, pratica: text })
            }
          />

          <TextInput
            label="Campos de Experiências"
            mode="outlined"
            style={styles.textarea}
            multiline
            value={registro.campo}
            onChangeText={(text) => setRegistro({ ...registro, campo: text })}
          />

          <TextInput
            label="Objetos de Aprendizagem"
            mode="outlined"
            style={styles.textarea}
            multiline
            value={registro.objeto}
            onChangeText={(text) => setRegistro({ ...registro, objeto: text })}
          />

          <Divider style={{ marginTop: 15 }} />

          <View style={styles.botaoContainer}>
            <Button
              mode="contained"
              onPress={salvarRegistro}
              buttonColor="#2196F3"
              style={styles.botao}
            >
              Atualizar
            </Button>
            <Button
              mode="contained"
              onPress={excluirRegistro}
              buttonColor="#E53935"
              style={styles.botao}
            >
              Excluir
            </Button>
          </View>
        </Card>
      </ScrollView>

      {/* Modais */}
      <SuccessModal
        visible={modalSucessoVisible}
        message="Registro atualizado com sucesso!"
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
  scrollContainer: { padding: 10 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  sublabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E88E5",
    textAlign: "center",
    marginBottom: 4,
  },
  textoDatas: {
    fontSize: 12,
    color: "#111",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "700"
  },

  textarea: {
    marginTop: 4,
    minHeight: 100,
    textAlignVertical: "top",
  },

  botaoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  botao: {
    flex: 0.48,
    borderRadius: 6,
  },
});
