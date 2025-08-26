import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Divider, View } from 'react-native';
import Modelo from '../componentes/Modelo';
import Botoes from '../componentes/Botoes'
import Card from '../componentes/Cards'

export default function HomeScreen() {
  return (
    <Modelo
      title="Notas"
      userName="Anderson"
      onMenuPress={() => console.log('Menu')}
      onNotificationPress={() => console.log('Notificações')}
    >
      {/* Conteúdo específico da tela Notas */}
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>Minhas Notas</Text>
      </TouchableOpacity>

      <View>
        <Botoes title="Salvar" outline onPress={() => console.log('Salvar')} />
      </View>
      
      <View style={styles.visual}>
        <Botoes title="Cancelar"  onPress={() => console.log('Cancelar')} />
      </View>

      <Card title="Notas" type='success' outline onPress={() => console.log('Abrir Notas')}>
        <Text style={{ color: '#198754' }}>Visualize suas notas aqui.</Text>
      </Card>

      <Card type='info'>
        <Text>Esse card não tem título, é só conteúdo.</Text>
      </Card>
  

    </Modelo>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
  },
  visual: {
    paddingTop: 10,
    paddingBottom: 10,
  }
});
