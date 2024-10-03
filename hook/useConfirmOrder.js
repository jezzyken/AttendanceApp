import {useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import config from '../config/config';

const useConfirmOrder = (cartItems, totalPrice) => {
  const navigation = useNavigation();
  const parsedCartItems = JSON.parse(cartItems);
  const totalItems = parsedCartItems.length;
  const salesTotal = totalPrice;

  const [delivery, setDelivery] = useState('yes');
  const [customer, setCustomerName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [amountReceived, setPaidAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirmOrder = async () => {
    setLoading(true);
    const hasDelivery = delivery === 'yes';
    const deliveryInfo = hasDelivery
      ? {address, notes, recipientName, contactNo, deliveryDate}
      : {};

    const data = {
      customer,
      amountReceived,
      change: amountReceived - salesTotal,
      salesTotal,
      grandTotal: salesTotal,
      totalItems,
      hasDelivery,
      stocks: parsedCartItems,
      delivery: deliveryInfo,
    };

    try {
      await axios.post(`${config.apiUrl}/sales`, data);
      await AsyncStorage.removeItem('@cart_items');
      navigation.navigate('Complete', {data});
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    delivery,
    customer,
    recipientName,
    contactNo,
    deliveryDate,
    address,
    notes,
    amountReceived,
    salesTotal,
    totalItems,
    setDelivery,
    setCustomerName,
    setRecipientName,
    setContactNo,
    setDeliveryDate,
    setAddress,
    setNotes,
    setPaidAmount,
    handleConfirmOrder,
  };
};

export default useConfirmOrder;
