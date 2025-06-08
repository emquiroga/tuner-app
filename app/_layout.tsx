import { Stack } from "expo-router";
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Layout principal de la aplicación
const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Afinador de Guitarra',
          headerShown: true,
        }} 
      />
    </Stack>
  );
};

export default RootLayout;
