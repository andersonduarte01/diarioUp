import React, { useState, useContext, useCallback } from "react";
import { Alert, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
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
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../contexto/AuthContext";
import api from "../../services/Api";

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
      response.data.forEach(item => {
        freqObj[item.data] = item.frequencia_registrada;
      });
      setFrequenciasMes(freqObj);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar as frequências.");
    }
  };

  // Atualiza sempre que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      fetchFrequencias();
    }, [currentDate, authTokens])
  );

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
      <TouchableOpacity
        style={[
          styles.dayContainer,
          !isCurrentMonth && styles.outsideMonth,
          isWeekend && styles.weekendDay,
          isFrequenciaCadastrada && styles.frequenciaDia
        ]}
        disabled={isWeekend}
        onPress={onPressDay}
      >
        <Text
          style={[
            styles.dayText,
            !isCurrentMonth && styles.outsideMonthText,
            isWeekend && styles.weekendDayText,
            isFrequenciaCadastrada && styles.frequenciaDiaText
          ]}
        >
          {format(item, "d")}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sala.descricao}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.monthContainer}>
          <TouchableOpacity onPress={() => setCurrentDate(subMonths(currentDate, 1))}>
            <Text style={styles.navButton}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </Text>
          <TouchableOpacity onPress={() => setCurrentDate(addMonths(currentDate, 1))}>
            <Text style={styles.navButton}>▶</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekHeader}>
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
            <Text key={day} style={styles.weekDay}>{day}</Text>
          ))}
        </View>

        <FlatList
          data={daysInMonth}
          renderItem={renderDay}
          keyExtractor={item => item.toISOString()}
          numColumns={7}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E88E5", paddingVertical: 16, paddingHorizontal: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  card: { backgroundColor: "#fff", margin: 8, padding: 10, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 4 },

  monthContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  monthText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  navButton: { fontSize: 20, fontWeight: "bold", color: "#007AFF" },

  weekHeader: { flexDirection: "row", justifyContent: "space-around", paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 5 },
  weekDay: { flex: 1, textAlign: "center", fontWeight: "bold", color: "#555" },

  dayContainer: { flex: 1, margin: 2, padding: 12, alignItems: "center", justifyContent: "center", borderRadius: 8 },
  dayText: { fontSize: 16, color: "#000" },
  outsideMonth: { backgroundColor: "#f0f0f0" },
  outsideMonthText: { color: "#aaa" },
  weekendDay: { backgroundColor: "#f8d7da" },
  weekendDayText: { color: "#a00" },

  frequenciaDia: { backgroundColor: "#bbdefb" },
  frequenciaDiaText: { color: "#1E88E5", fontWeight: "bold" },
});
