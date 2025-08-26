import React, { useContext } from 'react';
import { View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../contexto/AuthContext';

import DashProfessorScreen from '../telas/professor/DashProfessorScreen';
import ProNotificacoesScreen from '../telas/professor/ProNotificacoesScreen';
import AjudaScreen from '../telas/professor/AjudaScreen';
import ProPerfilScreen from '../telas/professor/ProPerfilScreen';
import ProConfiguracoesScreen from '../telas/professor/ProConfiguracoesScreen';
// import AddSalaScreen from '../telas/escola/AddSalaScreen';

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
        else if (route.name === 'Ajuda') iconName = 'help-circle-outline';
        else if (route.name === 'Notificações') iconName = 'notifications-outline';
        else if (route.name === 'Configurações') iconName = 'settings-outline';

        return {
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarIcon: ({ color, size }) => <Ionicons name={iconName} size={size} color={color} />,
        };
      }}
    >
      <Tab.Screen name="Início" component={DashProfessorScreen} />
      <Tab.Screen name="Notificações" component={ProNotificacoesScreen} />
      <Tab.Screen name="Ajuda" component={AjudaScreen} />
      <Tab.Screen name="Configurações" component={ProConfiguracoesScreen} />
    </Tab.Navigator>
  );
}


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

export default function ProfessorStack() {
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
      <Drawer.Screen name="Perfil" component={ProPerfilScreen} />
    </Drawer.Navigator>
  );
}
