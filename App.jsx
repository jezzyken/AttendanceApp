import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigation from './navigation/BottomTabNavigation';
import StudentList from './screens/StudentList';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BottomNavigation"
          component={BottomTabNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StudentList"
          component={StudentList}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
