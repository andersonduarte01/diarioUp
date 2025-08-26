import React, { useEffect, useState, useContext } from "react";
import { ScrollView, View, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { TextInput, Button, Text, useTheme, Card, Title } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import api from "../../services/Api";
import { AuthContext } from "../../contexto/AuthContext";
import { SuccessModal, ErrorModal } from '../../componentes/AppModal';

export default function CadastrarSalaScreen({ navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);

  const [descricao, setDescricao] = useState("");
  const [turno, setTurno] = useState("");
  const [ano, setAno] = useState("");
  const [anosDisponiveis, setAnosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);
  
  useEffect(() => {
    const fetchAnos = async () => {
      try {
        const anosRes = await api.get("salas/anos/anos/", {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setAnosDisponiveis(Array.isArray(anosRes.data) ? anosRes.data : anosRes.data.results || []);
      } catch (error) {
        console.log("Erro ao buscar anos:", error);
        Alert.alert("Erro", "Não foi possível carregar os anos disponíveis.");
      }
      setLoading(false);
    };
    fetchAnos();
  }, []);

  const handleCadastrar = async () => {
    if (!descricao || !turno || !ano) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      await api.post(
        "salas/api/salas/",
        { descricao, turno, ano },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );

      setDescricao("");
      setTurno("");
      setAno("");
      setModalSucessoVisible(true);

    } catch (error) {
      setModalErroVisible(true);
    }
  };


  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container(theme)}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Cadastrar Sala</Title>

          <TextInput
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            style={styles.input}
          />

          <Text style={styles.label}>Turno</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={turno} onValueChange={(itemValue) => setTurno(itemValue)}>
              <Picker.Item label="Selecione o turno" value="" />
              <Picker.Item label="Manhã" value="manha" />
              <Picker.Item label="Tarde" value="tarde" />
              <Picker.Item label="Tempo Integral" value="integral" />
            </Picker>
          </View>

          <Text style={styles.label}>Ano</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={ano} onValueChange={(itemValue) => setAno(itemValue)}>
              <Picker.Item label="Selecione o ano" value="" />
              {anosDisponiveis.map((a) => (
                <Picker.Item key={a.id} label={a.descricao} value={a.id} />
              ))}
            </Picker>
          </View>

          <Button
            mode="contained"
            icon="content-save-outline"
            onPress={handleCadastrar}
            style={styles.button}
          >
            Cadastrar Sala
          </Button>
        </Card.Content>
      </Card>

      <SuccessModal
        visible={modalSucessoVisible}
        message="Sala cadastrada com sucesso!"
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
  container: (theme) => ({
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  }),
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 8,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "700",
    color: "#0D6EFD"
  },
  input: {
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
  },
  button: {
    marginTop: 8,
  },
});
