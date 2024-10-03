import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, Image} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  BLEPrinter,
  NetPrinter,
  USBPrinter,
  IUSBPrinter,
  IBLEPrinter,
  INetPrinter,
  ColumnAlignment,
  COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';
import {useRoute} from '@react-navigation/native';

const printerList = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
};

const ProductDetails = () => {
  const route = useRoute();
  const {item} = route.params;
  const [selectedValue, setSelectedValue] = useState('ble');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState({});

  useEffect(() => {
    const getListDevices = async () => {
      const Printer = printerList[selectedValue];
      if (selectedValue === 'net') return;
      try {
        setLoading(true);
        await Printer.init();
        const results = await Printer.getDeviceList();
        setDevices(
          results.map(item => ({...item, printerType: selectedValue})),
        );
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    getListDevices();
    handleConnectSelectedPrinter();
  }, [selectedValue]);

  const handleConnectSelectedPrinter = () => {
    const connect = async () => {
      try {
        setLoading(true);
        await BLEPrinter.connectPrinter('86:67:7A:60:CE:C7' || '');
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    connect();
  };

  const handlePrint = async () => {
    try {
      const Printer = printerList[selectedValue];
      const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
      const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
      const orderList = [
        [`${item.name}`, '2', '50$']
      ];
      const columnAlignment = [
        ColumnAlignment.LEFT,
        ColumnAlignment.CENTER,
        ColumnAlignment.RIGHT,
      ];
      const columnWidth = [30 - (7 + 12), 7, 12];
      const header = ['Items', 'Qty', 'Price'];
      Printer.printColumnsText(header, columnWidth, columnAlignment, [
        `${BOLD_ON}`,
      ]);
      for (const order of orderList) {
        Printer.printColumnsText(order, columnWidth, columnAlignment, [
          `${BOLD_OFF}`,
        ]);
      }
      Printer.printBill('Thank you\n');
    } catch (err) {
      console.warn(err);
    }
  };

  const handleChangePrinterType = async type => {
    setSelectedValue(prev => {
      printerList[prev].closeConn();
      return type;
    });
    setSelectedPrinter({});
  };

  const handleChangeHostAndPort = params => text =>
    setSelectedPrinter(prev => ({
      ...prev,
      device_name: 'Net Printer',
      [params]: text,
      printerType: 'net',
    }));

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Image source={{uri: item.image}} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.description}</Text>
      </View>
      <Button title="Print sample" onPress={handlePrint} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  section: {
    flex: 1,
  },
  rowDirection: {
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
});

export default ProductDetails;
