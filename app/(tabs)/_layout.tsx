import { Link, Tabs } from 'expo-router';
import { TouchableOpacity, Text, View } from 'react-native';

import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../lib/auth';

export default function TabLayout() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#ea580c',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 15,
            height: 90,
            paddingBottom: 20,
            paddingTop: 10,
            backdropFilter: 'blur(20px)',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          headerStyle: {
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          },
          headerTitleStyle: {
            color: '#ffffff',
            fontSize: 20,
            fontWeight: '700',
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => <TabBarIcon name="cutlery" color={color} />,
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Pedidos',
            tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
