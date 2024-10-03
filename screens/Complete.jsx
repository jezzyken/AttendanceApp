import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Animated} from 'react-native';
import {
  BLEPrinter,
  ColumnAlignment,
  COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'

const Complete = ({route}) => {
  const {data} = route.params;
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    handleConnectSelectedPrinter();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });

    return unsubscribe;
  }, []);

  const handleConnectSelectedPrinter = async () => {
    await BLEPrinter.init();
    const connect = async () => {
      try {
        await BLEPrinter.connectPrinter('86:67:7A:60:CE:C7' || '');
        await handlePrint();
      } catch (err) {
        console.warn(err);
      }
    };
    connect();
  };

  const handlePrint = async () => {
    try {
      const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
      const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
      const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
      const SMALL_FONT = COMMANDS.TEXT_FORMAT.TXT_SIZE_SMALL;
      const {change, customer, amountReceived, stocks, salesTotal} = data;

      const header = ['Items', 'Qty', 'Price'];
      const columnAlignment = [
        ColumnAlignment.LEFT,
        ColumnAlignment.CENTER,
        ColumnAlignment.RIGHT,
      ];
      const columnWidth = [30 - (7 + 12), 7, 12];

      const orderList = stocks.map(item => [
        item.variant
          ? `${item.name || 'Unknown item'} (${
              item.variantName || 'Unknown variant'
            })`
          : item.name || 'Unknown item',
        item.quantity?.toString() || '0',
        'P' + (item.price || 0), 
        'P' + (item.price || 0) * (item.quantity || 0), 
      ]);

      await BLEPrinter.printText(`Customer: ${customer}\n`);

      await BLEPrinter.printColumnsText(header, columnWidth, columnAlignment, [
        `${BOLD_ON}`,
      ]);

      await BLEPrinter.printText(
        `${CENTER}--------------------------------${CENTER}\n`,
      );

      for (const order of orderList) {
        await BLEPrinter.printColumnsText(order, columnWidth, columnAlignment, [
          `${BOLD_OFF}`,
        ]);
      }

      await BLEPrinter.printText('\n');
      await BLEPrinter.printText(`Total Sales Amount: P${salesTotal}\n`);
      await BLEPrinter.printText(`Paid Amount: P${amountReceived}\n`);
      await BLEPrinter.printText(`Change: P${change}\n`);
      await BLEPrinter.printBill(`${CENTER}Thank you\n`);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View style={styles.content}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Icon name="check-circle" size={100} color="#FFFFFF" />
        </Animated.View>
        <Text style={styles.title}>Order Completed!</Text>
        <Text style={styles.subtitle}>Your order has been successfully processed.</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Customer: {data.customer}</Text>
          <Text style={styles.infoText}>Total: ₱{data.salesTotal}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Back to Main Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#E8F5E9',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },

  iconContainer: {
    marginBottom: 20,
  }
});

export default Complete;
