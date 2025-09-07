import React, { useState, useContext } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexto/AuthContext";
import api from "../../services/Api";
import { 
  Appbar, 
  Text, 
  TextInput, 
  Button, 
  Divider, 
  Card 
} from "react-native-paper";
import { SuccessModal, ErrorModal } from "../../componentes/AppModal";

export default function AdicionarRegistro({ route }) {
  const { sala, inicioSemana, fimSemana } = route.params;
  const navigation = useNavigation();
  const { authTokens } = useContext(AuthContext);

  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);

  const [pratica, setPratica] = useState("");
  const [campo, setCampo] = useState("");
  const [objeto, setObjeto] = useState("");

  const salvarRegistro = async () => {
    if (!authTokens) return;
    try {
      await api.post(
        "frequencia/api/registros/",
        {
          sala: sala.id,
          data: inicioSemana.toISOString().split("T")[0],
          data_fim: fimSemana.toISOString().split("T")[0],
          pratica,
          campo,
          objeto,
        },
        {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        }
      );
      setModalSucessoVisible(true);
    } catch (error) {
      setModalErroVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#007AFF' }}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Adicionar Registro"  titleStyle={{ color: '#fff' }}/>
      </Appbar.Header>

      <ScrollView style={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sublabel}>
              Período
            </Text>
            <Text style={styles.textoDatas}>
              {inicioSemana.toLocaleDateString()} à {fimSemana.toLocaleDateString()}
            </Text>

            <Divider style={{ marginTop: 12, marginBottom: 12 }} />
            <TextInput
              label="Práticas que possibilitam"
              mode="outlined"
              multiline
              numberOfLines={6}
              value={pratica}
              onChangeText={setPratica}
              style={styles.textarea}
              outlineColor="#d6d3d3"
            />
            <TextInput
              label="Campos de Experiências"
              mode="outlined"
              multiline
              numberOfLines={6}
              value={campo}
              onChangeText={setCampo}
              style={styles.textarea}
              outlineColor="#d6d3d3"
            />
            <TextInput
              label="Objetos de Aprendizagem"
              mode="outlined"
              multiline
              numberOfLines={6}
              value={objeto}
              onChangeText={setObjeto}
              style={styles.textarea}
              outlineColor="#d6d3d3"
            />
            <Divider style={{ marginTop: 16 }} />  
            <Button
              mode="contained"
              onPress={salvarRegistro}
              style={styles.botao}
            >
              Salvar Registro
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Modais */}
      <SuccessModal
        visible={modalSucessoVisible}
        message="Registro cadastrado com sucesso!"
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
  card: { marginBottom: 20, borderRadius: 12 },
  textarea: {
    marginTop: 8,
    backgroundColor: "#fff",
    minHeight: 100,
    textAlignVertical: "top", 
  },
  textoDatas: {
    marginTop: 4,
    fontSize: 12,
    color: "#111",
    textAlign: "center",
    fontWeight: "700"
  },
  botao: {
    marginTop: 16,
    borderRadius: 6,
  },
  sublabel: {
    fontWeight: "bold",
    color: "#1E88E5",
    textAlign: "center",
  },
});
