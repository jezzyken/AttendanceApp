import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Schedule from '../screens/Schedule';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    elevation: 0,
    height: 50,
  },
};

const BottomTabNavigation = ({route}) => {
  const {teacherId, teacherData} = route.params;
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{teacherId, teacherData}}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                size={24}
                color={focused ? '#4A90E2' : 'gray'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        initialParams={{teacherId, teacherData}}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <MaterialCommunityIcons
                name={focused ? 'clock' : 'clock-outline'}
                size={24}
                color={focused ? '#4A90E2' : 'gray'}
              />
            );
          },
        }}
      />
      {/* <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <MaterialCommunityIcons
                name={focused ? 'clipboard-text' : 'clipboard-text-outline'}
                size={24}
                color={focused ? '#FF5733' : 'gray'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <MaterialCommunityIcons
                name={focused ? 'truck-delivery' : 'truck-delivery-outline'}
                size={24}
                color={focused ? '#FF5733' : 'gray'}
              />
            );
          },
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
