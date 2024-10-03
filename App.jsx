import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigation from './navigation/BottomTabNavigation';
import ProductDetails from './screens/ProductDetails';
import Cart from './screens/Cart';
import Confirmation from './screens/Confirmation';
import DeliveryInfo from './screens/DeliveryInfo';
import TransactionInfo from './screens/TransactionInfo';
import StudentList from './screens/StudentList';

import Complete from './screens/Complete';

import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {PermissionsAndroid} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const requestPermissionsAndEnableBluetooth = async () => {
      try {
        const bluetoothConnectPermission = await request(
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        );
        const bluetoothScanPermission = await request(
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        );
        const fineLocationPermission = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );

        if (
          bluetoothConnectPermission === RESULTS.GRANTED &&
          bluetoothScanPermission === RESULTS.GRANTED &&
          fineLocationPermission === RESULTS.GRANTED
        ) {
          await enableBluetooth();
        } else {
          console.log('Permissions not granted');
        }
      } catch (error) {
        console.error('Failed to request permissions', error);
      }
    };

    const enableBluetooth = async () => {
      try {
        const isBluetoothEnabled =
          await BluetoothStateManager.requestToEnable();
        if (!isBluetoothEnabled) {
          await BluetoothStateManager.enable();
        }
      } catch (error) {
        console.error('Failed to enable Bluetooth', error);
      }
    };

    requestPermissionsAndEnableBluetooth();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Botton Navigation"
          component={BottomTabNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Confirmation"
          component={Confirmation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Complete"
          component={Complete}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DeliveryInfo"
          component={DeliveryInfo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TransactionInfo"
          component={TransactionInfo}
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
