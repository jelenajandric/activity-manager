import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import InitialPage from './src/screens/initial/InitialPage';
import AddActivity from './src/screens/add-activity/AddActivity';
import AddImage from './src/screens/add-activity/AddImage';
import { Provider } from 'react-redux';
import { Store } from './src/redux/store'
import { HomeTabParamList, RootStackParamList } from './src/types';
import OneActivityReview from './src/screens/review/OneAcitivityReview';
import Settings from './src/screens/settings/Settings';
import Review from './src/screens/review/Review';

const Tab = createBottomTabNavigator<HomeTabParamList>();

function HomeTabs(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={
        ({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = "";
            if (route.name === 'Review') {
              iconName = 'calendar-alt';
              size = focused ? 25 : 20;
            } else if (route.name === "AddActivity") {
              iconName = 'plus';
              size = focused ? 25 : 20
            } else if (route.name === "Settings") {
              iconName = 'cog';
              size = focused ? 25 : 20
            }
            return (
              <FontAwesome5
                name={iconName}
                size={size}
                color={color}
              />
            );
          },

          tabBarActiveTintColor: '#D27D2D',
          tabBarInactiveTintColor: '#777777',
          tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold' }
        })
      }
    >

      <Tab.Screen
        name={'Review'}
        component={Review}
        options={{
          headerShown: false,
          title: 'Prikaz'

        }}
      />
      <Tab.Screen
        name={'AddActivity'}
        component={AddActivity}
        options={{
          // headerShown: false,
          title: 'Dodaj aktivnost',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#D27D2D',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold'
          }
        }}
      />
      <Tab.Screen
        name={'Settings'}
        component={Settings}
        options={{
          title: 'Podešavanja',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#D27D2D',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold'
          }
        }}
      />
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='InitialPage'
        >
          <Stack.Screen
            name='InitialPage'
            component={InitialPage}
            options={{
              headerShown: false
            }} />
          <Stack.Screen
            name='HomeScreen'
            component={HomeTabs}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name='AddImage'
            component={AddImage}
            options={{
              title: 'Dodaj fotografije',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#D27D2D',
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontSize: 25,
                fontWeight: 'bold'
              }
            }}
          />
          <Stack.Screen
            name='OneActivityReview'
            component={OneActivityReview}
            options={{
              title: 'Pregled aktivnosti',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#D27D2D',
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontSize: 25,
                fontWeight: 'bold'
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>

  );
}

export default App;
