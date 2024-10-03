import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DeliveryInfo = ({ route, navigation }) => {
  const { delivery } = route.params;

  const formatPrice = (price) => {
    return price !== undefined ? parseFloat(price).toFixed(2) : '0.00';
  };

  const renderItem = ({ item }) => {
    const sellingPrice = item.variant
      ? item.variant.sellingPrice
      : item.product.sellingPrice;

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>Items: {item.product.name}</Text>
        <Text style={styles.itemDetail}>Qty: {item.quantity}</Text>
        <Text style={styles.itemDetail}>
          Variant: {item.variant ? item.variant.name : 'No variant available'}
        </Text>
        <Text style={styles.itemDetail}>
          Price: P{formatPrice(sellingPrice)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Delivery Info</Text>
      </View>

      <View style={styles.scrollContent}>
        <View style={styles.statusContainer}>
          <Text style={styles.subtitle}>Delivery Status</Text>
          <Text
            style={delivery.status === 'pending' ? styles.pending : styles.delivered}>
            {delivery.status}
          </Text>
        </View>
        <View style={styles.horizontalLine} />

        <Text style={styles.txtColor}>Recipient: {delivery.recipientName}</Text>
        <Text style={styles.txtColor}>Address: {delivery.address}</Text>
        <Text style={styles.txtColor}>Delivery Date: {delivery.date}</Text>

        <View style={styles.horizontalLine} />
        <Text style={styles.subtitle}>
          Purchased Items ({delivery.items.length})
        </Text>

        <FlatList
          data={delivery.items}
          renderItem={renderItem}
          keyExtractor={item => item.item_id.toString()}
          contentContainerStyle={{ paddingBottom: 110 }}
        />
      </View>

      <View style={styles.fixedButtonContainer}>
        <Text style={styles.amount}>
          Total Purchased: P{formatPrice(delivery.saleDetails.salesTotal)}
        </Text>
        <Button
          title="Mark as Delivered"
          onPress={() => alert('This function will be available soon :)')}
          color="#FF4500"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  pending: {
    color: 'orange',
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: 'bold',
  },
  delivered: {
    color: 'green',
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtColor: {
    color: '#333',
    fontSize: 14,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetail: {
    fontSize: 14,
    color: '#777',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default DeliveryInfo;
