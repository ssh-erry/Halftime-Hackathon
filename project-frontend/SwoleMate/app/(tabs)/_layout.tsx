import { Tabs } from 'expo-router';
import { View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#ff8c00',
            headerStyle: {
            backgroundColor: '#25292e',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
            backgroundColor: '#25292e',
            },
        }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24}/>
          ),
        }}
      />
			<Tabs.Screen
        name="matching"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,

                backgroundColor: '#fff',

                borderWidth: focused ? 5 : 2,
                borderColor: '#ff8c00',

                justifyContent: 'center',
                alignItems: 'center',

                marginTop: -30,
              }}
            >
              <Image
                source={require('../../assets/images/swolemate-icon.png')}
                style={{
                  width: 40,
                  height: 40,
                  resizeMode: 'contain',
                }}
              />
            </View>
          ),
        }}
      />
    	<Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} size={24}/>
          ),
        }}
      />
    	<Tabs.Screen
        name="workout"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'barbell' : 'barbell-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}