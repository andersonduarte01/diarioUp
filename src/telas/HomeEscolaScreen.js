import React, { useContext } from 'react';
import { View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../contexto/AuthContext';

import DashboardScreen from '../telas/escola/DashboardScreen';
import NotificacoesScreen from '../telas/escola/NotificacoesScreen';
import AddProfessorScreen from '../telas/escola/AddProfessorScreen';
import PerfilScreen from '../telas/escola/PerfilScreen';
import AddSalaScreen from '../telas/escola/AddSalaScreen';
import ListaProfessoresScreen from '../telas/escola/ListaProfessoresScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs
function DashboardTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        let iconName;
        if (route.name === 'Início') iconName = 'home-outline';
        else if (route.name === 'Adicionar Professor') iconName = 'school-outline';
        else if (route.name === 'Notificações') iconName = 'notifications-outline';
        else if (route.name === 'Adicionar Sala') iconName = 'layers-outline';

        return {
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarIcon: ({ color, size }) => <Ionicons name={iconName} size={size} color={color} />,
        };
      }}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Adicionar Sala" component={AddSalaScreen} />
      <Tab.Screen name="Adicionar Professor" component={AddProfessorScreen} />
      <Tab.Screen name="Notificações" component={NotificacoesScreen} />
    </Tab.Navigator>
  );
}

// Drawer customizado
function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={{ margin: 10 }}>
        <Button mode="contained" onPress={logout} icon="logout">
          Sair
        </Button>
      </View>
    </DrawerContentScrollView>
  );
}

export default function EscolaStack() {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.onPrimary,
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardTabs} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
      <Drawer.Screen name="Professores" component={ListaProfessoresScreen}/>
    </Drawer.Navigator>
  );
}
