import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TransactionInfo = ({route, navigation}) => {
  const {transaction} = route.params;

  const formatPrice = price => {
    return price !== undefined ? parseFloat(price).toFixed(2) : '0.00';
  };

  const renderItem = ({item}) => {
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

  const handlePrint = () => {
    alert('Print function will be available soon :)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction Info</Text>
        <TouchableOpacity onPress={handlePrint} style={styles.printButton}>
          <MaterialCommunityIcons name="printer" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />

      <Text style={styles.customer}>Customer: {transaction.customer}</Text>
      <Text style={styles.referenceNo}>
        Reference No: {transaction.referenceCode}
      </Text>
      <Text style={styles.date}>
        Date: {moment(transaction.date).format('YYYY-MM-DD HH:mm A')}
      </Text>
      <Text style={styles.PurchasedItems}>
        Purchased Items ({transaction.items.length})
      </Text>

      <View style={styles.horizontalLine} />


        <FlatList
          data={transaction.items}
          renderItem={renderItem}
          keyExtractor={item => item.item_id.toString()}
          contentContainerStyle={{ paddingBottom: 70 }}
        />


      <View style={styles.fixedButtonContainer}>
        <Text style={styles.amount}>
          Total Purchased: P{formatPrice(transaction.salesTotal)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  PurchasedItems: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  referenceNo: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#757575',
  },
  customer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  footerContainer: {
    paddingTop: 10,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 14,
    color: '#757575',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  printButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
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
});

export default TransactionInfo;
