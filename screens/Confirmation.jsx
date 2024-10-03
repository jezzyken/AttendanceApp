import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import useConfirmOrder from '../hook/useConfirmOrder';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ConfirmationScreen = ({route}) => {
  const {cartItems, totalPrice} = route.params;
  const {
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
    loading,
    setDelivery,
    setCustomerName,
    setRecipientName,
    setContactNo,
    setDeliveryDate,
    setAddress,
    setNotes,
    setPaidAmount,
    handleConfirmOrder,
  } = useConfirmOrder(cartItems, totalPrice);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const isCustomerValid = customer.trim() !== '';
      const isAmountValid = parseFloat(amountReceived) >= salesTotal;

      if (delivery === 'yes') {
        const isRecipientValid = recipientName.trim() !== '';
        const isContactValid = contactNo.trim() !== '';
        const isAddressValid = address.trim() !== '';

        setIsFormValid(
          isCustomerValid &&
            isAmountValid &&
            isRecipientValid &&
            isContactValid &&
            isAddressValid,
        );
      } else {
        setIsFormValid(isCustomerValid && isAmountValid);
      }
    };

    validateForm();
  }, [
    customer,
    recipientName,
    contactNo,
    deliveryDate,
    address,
    amountReceived,
    delivery,
    salesTotal,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Customer Name"
            value={customer}
            onChangeText={setCustomerName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Options</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, delivery === 'yes' && styles.radioButtonActive]}
              onPress={() => setDelivery('yes')}>
              <Text style={[styles.radioLabel, delivery === 'yes' && styles.radioLabelActive]}>YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, delivery === 'no' && styles.radioButtonActive]}
              onPress={() => setDelivery('no')}>
              <Text style={[styles.radioLabel, delivery === 'no' && styles.radioLabelActive]}>NO</Text>
            </TouchableOpacity>
          </View>
        </View>

        {delivery === 'yes' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Recipient Name"
              value={recipientName}
              onChangeText={setRecipientName}
              placeholderTextColor="#999"
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Contact"
                value={contactNo}
                onChangeText={setContactNo}
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Delivery Date"
                value={deliveryDate}
                onChangeText={setDeliveryDate}
                placeholderTextColor="#999"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor="#999"
              multiline
            />
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Information</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.infoText}>Total Items: {totalItems}</Text>
            <Text style={styles.infoText}>Total Amount: ₱{salesTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Amount Received"
              value={amountReceived}
              onChangeText={setPaidAmount}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Change"
              value={Math.max(amountReceived - salesTotal, 0).toFixed(2)}
              editable={false}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, (!isFormValid || loading) && styles.disabledButton]}
          onPress={handleConfirmOrder}
          disabled={!isFormValid || loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="check-circle" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#FF5733',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  radioButtonActive: {
    backgroundColor: '#FF5733',
  },
  radioLabel: {
    fontSize: 16,
    color: '#FF5733',
  },
  radioLabelActive: {
    color: '#fff',
  },
  paymentInfo: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#FF5733',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ffad99',
  },
  buttonIcon: {
    marginRight: 8,
  },
});
;

export default ConfirmationScreen;
