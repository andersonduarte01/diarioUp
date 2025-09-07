import React, { useState, useContext, useCallback } from "react";
import { View, FlatList, Alert, StyleSheet } from "react-native";
import {
  Text,
  Card,
  IconButton,
  Appbar,
} from "react-native-paper";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, addMonths, subMonths, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexto/AuthContext";
import api from "../../services/Api";

export default function SemanasBlocosScreen({ route }) {
  const { sala } = route.params;
  const navigation = useNavigation();
  const { authTokens } = useContext(AuthContext);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [semanasMes, setSemanasMes] = useState([]);

  const primeiraSegundaNoMes = (date) => {
    const inicioMes = startOfMonth(date);
    const segundaDaSemana = startOfWeek(inicioMes, { weekStartsOn: 1 });
    return isBefore(segundaDaSemana, inicioMes) ? addDays(segundaDaSemana, 7) : segundaDaSemana;
  };

  const gerarSemanasDoMes = (date) => {
    const semanas = [];
    const ultimoDia = endOfMonth(date);
    let segunda = primeiraSegundaNoMes(date);

    while (!isAfter(segunda, ultimoDia)) {
      semanas.push({ inicio: segunda });
      segunda = addDays(segunda, 7);
    }
    return semanas;
  };

  const fetchRegistros = async () => {
    if (!authTokens) return;
    try {
      const semanas = gerarSemanasDoMes(currentDate);

      const semanasComStatus = await Promise.all(
        semanas.map(async (semana) => {
          const inicioStr = format(semana.inicio, "yyyy-MM-dd");
          const fimSemana = addDays(semana.inicio, 4);
          const fimStr = format(fimSemana, "yyyy-MM-dd");

          const response = await api.get(
            `frequencia/api/registros/?sala=${sala.id}&data__gte=${inicioStr}&data__lte=${fimStr}`,
            { headers: { Authorization: `Bearer ${authTokens.access}` } }
          );

          const registros = response.data?.results ?? [];
          const registroExiste = registros.length > 0;
          const registroId = registroExiste ? registros[0].id : null;

          return {
            inicio: semana.inicio,
            fim: fimSemana,
            registroExiste,
            registroId,
          };
        })
      );

      setSemanasMes(semanasComStatus);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os registros.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRegistros();
    }, [currentDate, authTokens])
  );

  const renderSemana = ({ item }) => {
    const inicioStr = format(item.inicio, "dd/MM");
    const fimStr = format(item.fim, "dd/MM");

    const corFundo = item.registroExiste ? "#bbdefb" : "#f0f0f0";
    const textoCor = item.registroExiste ? "#1E88E5" : "#555";

    const onPressSemana = () => {
      if (item.registroExiste) {
        navigation.navigate("EditarRegistro", { registroId: item.registroId });
      } else {
        navigation.navigate("AddRegistroScreen", {
          sala,
          inicioSemana: item.inicio,
          fimSemana: item.fim,
        });
      }
    };

    return (
      <Card style={[styles.semanaCard, { backgroundColor: corFundo }]} onPress={onPressSemana}>
        <Card.Content style={styles.semanaContent}>
          <Text style={[styles.semanaTexto, { color: textoCor }]}>
            {`Seg – Sex ${inicioStr} - ${fimStr}`}
          </Text>
          <IconButton
            icon={item.registroExiste ? "clipboard-edit-outline" : "plus-circle-outline"}
            size={24}
            iconColor={textoCor}
            onPress={onPressSemana}
          />
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Appbar Header */}
      <Appbar.Header style={{ backgroundColor: "#1E88E5" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title={sala.descricao} titleStyle={{ color: "#fff"}} />
      </Appbar.Header>

      {/* Card com mês e semanas */}
      <Card style={styles.card}>
        <Card.Content style={styles.monthContainer}>
          <IconButton
            icon="chevron-left"
            size={28}
            iconColor="#007AFF"
            onPress={() => setCurrentDate(subMonths(currentDate, 1))}
          />
          <Text style={styles.monthText}>
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </Text>
          <IconButton
            icon="chevron-right"
            size={28}
            iconColor="#007AFF"
            onPress={() => setCurrentDate(addMonths(currentDate, 1))}
          />
        </Card.Content>

        <FlatList
          data={semanasMes}
          renderItem={renderSemana}
          keyExtractor={(item) => format(item.inicio, "yyyy-MM-dd")}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  card: {
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    elevation: 4,
    padding: 10
  },
  monthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  monthText: { fontSize: 22, fontWeight: "bold", color: "#333" },
  semanaCard: {
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 6,
    paddingHorizontal: 4
  },
  semanaContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6, // menor padding para compactar
    paddingHorizontal: 10,
  },
  semanaTexto: { fontSize: 16, fontWeight: "bold" },
});
