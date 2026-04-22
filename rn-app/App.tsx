import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wsService } from './src/services/ws';
import { initToken } from './src/lib/token';
import { Text, View, ActivityIndicator } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60_000,
    },
  },
});

const Stack = createNativeStackNavigator();

// Placeholder screens - we will build these out!
function FeedScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Mecenate Feed (Native)</Text>
    </View>
  );
}

function PostDetailScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Post Details</Text>
    </View>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setup() {
      // 1. Initialize token from AsyncStorage
      await initToken();
      // 2. Start WebSocket
      wsService.connect();
      
      setIsReady(true);
    }
    setup();

    return () => wsService.destroy();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Лента' }} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Публикация' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
