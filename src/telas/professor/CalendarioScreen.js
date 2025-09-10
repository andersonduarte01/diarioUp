import React, { useState, useContext, useCallback } from "react";
import { Alert, View, StyleSheet, FlatList } from "react-native";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexto/AuthContext";
import api from "../../services/Api";
import { Platform, PermissionsAndroid } from "react-native";
import { Appbar, Text, Card, IconButton, Button, Divider } from "react-native-paper";

import RNFS from "react-native-fs";
import { Buffer } from "buffer"; // necessário para converter arraybuffer

export default function CalendarioScreen({ route }) {
  const { sala } = route.params;
  const navigation = useNavigation();
  const { authTokens } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [frequenciasMes, setFrequenciasMes] = useState({});

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 }),
  });

  const fetchFrequencias = async () => {
    if (!authTokens) return;
    try {
      const mesStr = format(currentDate, "yyyy-MM");
      const response = await api.get(
        `frequencia/api/frequencias/sala/${sala.id}/?mes=${mesStr}`,
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      const freqObj = {};
      response.data.forEach((item) => {
        freqObj[item.data] = item.frequencia_registrada;
      });
      setFrequenciasMes(freqObj);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar as frequências.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFrequencias();
    }, [currentDate, authTokens])
  );

  const salvarFrequenciaPDF = async () => {
    if (!authTokens) return;

    try {
      const mes = currentDate.getMonth() + 1;
      const url = `aluno/api/frequencia/${sala.id}/${mes}/`;

      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Permissão para salvar arquivos",
            message: "O app precisa de permissão para salvar o PDF na pasta Downloads",
            buttonPositive: "Permitir",
            buttonNegative: "Cancelar",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permissão negada", "Não foi possível salvar o PDF.");
          return;
        }
      }

      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
        responseType: "arraybuffer",
      });

      const base64Data = Buffer.from(response.data, "binary").toString("base64");
      const mes1 = currentDate.getMonth() + 1; 
      const ano1 = currentDate.getFullYear();
      const mesStr1 = mes1 < 10 ? `0${mes1}` : mes1;

      // Nome do arquivo único
      const fileName = `${sala.descricao}_${mesStr1}-${ano1}_frequencia.pdf`;
      const filePath =
        Platform.OS === "android"
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`; // iOS: usar sandbox

      // Salva o PDF
      await RNFS.writeFile(filePath, base64Data, "base64");

      Alert.alert("Sucesso", `PDF salvo em:\n${filePath}`);
      console.log("PDF salvo em:", filePath);
    } catch (error) {
      console.log("Erro ao salvar PDF:", error);
      Alert.alert("Erro", "Não foi possível salvar o PDF.");
    }
  };

  const renderDay = ({ item }) => {
    const isCurrentMonth = item.getMonth() === currentDate.getMonth();
    const isWeekend = item.getDay() === 0 || item.getDay() === 6;
    const diaStr = format(item, "yyyy-MM-dd");
    const isFrequenciaCadastrada = frequenciasMes[diaStr] === true;

    const onPressDay = () => {
      if (!isCurrentMonth || isWeekend) return;

      if (isFrequenciaCadastrada) {
        navigation.navigate("EditarFrequencia", {
          sala,
          dataSelecionada: diaStr,
        });
      } else {
        navigation.navigate("FrequenciaDiaria", {
          sala,
          dataSelecionada: diaStr,
        });
      }
    };

    return (
      <Card
        style={[
          styles.dayContainer,
          !isCurrentMonth && styles.outsideMonth,
          isWeekend && styles.weekendDay,
          isFrequenciaCadastrada && styles.frequenciaDia,
        ]}
        onPress={onPressDay}
      >
        <Card.Content style={{ alignItems: "center", padding: 4 }}>
          <Text
            style={[
              styles.dayText,
              !isCurrentMonth && styles.outsideMonthText,
              isWeekend && styles.weekendDayText,
              isFrequenciaCadastrada && styles.frequenciaDiaText,
            ]}
          >
            {format(item, "d")}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#1E88E5" }}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title={sala.descricao} color="#fff" />
      </Appbar.Header>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.monthContainer}>
            <IconButton
              icon="chevron-left"
              size={28}
              iconColor="#1E88E5"
              onPress={() => setCurrentDate(subMonths(currentDate, 1))}
            />
            <Text style={styles.monthText}>
              {format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </Text>
            <IconButton
              icon="chevron-right"
              size={28}
              iconColor="#1E88E5"
              onPress={() => setCurrentDate(addMonths(currentDate, 1))}
            />
          </View>

          <View style={styles.weekHeader}>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <Text key={day} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <FlatList
            data={daysInMonth}
            renderItem={renderDay}
            keyExtractor={(item) => item.toISOString()}
            numColumns={7}
          />
          <Divider style={{marginVertical: 10}}/>  
          <Button
            mode="contained"
            buttonColor="#1E88E5"
            textColor="#fff"
            onPress={salvarFrequenciaPDF}
            style={{ marginVertical: 5, borderRadius: 8, marginBottom: 1 }}
          >
            Gerar PDF
          </Button>           
        </Card.Content>       
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  card: {
    backgroundColor: "#fff",
    margin: 8,
    padding: 10,
    borderRadius: 12,
    elevation: 4,
  },
  monthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  monthText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 5,
  },
  weekDay: { flex: 1, textAlign: "center", fontWeight: "bold", color: "#555" },
  dayContainer: { flex: 1, margin: 1, borderRadius: 6, backgroundColor: "#FFF" },
  dayText: { fontSize: 16, color: "#000" },
  outsideMonth: { backgroundColor: "#f0f0f0" },
  outsideMonthText: { color: "#aaa" },
  weekendDay: { backgroundColor: "#f8d7da" },
  weekendDayText: { color: "#a00" },
  frequenciaDia: { backgroundColor: "#bbdefb" },
  frequenciaDiaText: { color: "#1E88E5", fontWeight: "bold" },
});
