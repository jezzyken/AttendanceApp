import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useFetchDeliveries from '../hook/useFetchDeliveries';

const Delivery = ({navigation}) => {
  const {deliveries, loading} = useFetchDeliveries();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeliveries = deliveries.filter(
    item =>
      item.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({item}) => (
    <View style={styles.rowFront}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('DeliveryInfo', {delivery: item})}>
        <View style={styles.deliveryInfo}>
          <View style={styles.textContainer}>
            <Text style={styles.recipient}>{item.recipientName}</Text>
            <Text style={styles.address}>{item.address}</Text>
          </View>
          <Text
            style={[
              styles.status,
              item.status === 'pending' ? styles.pending : styles.delivered,
            ]}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => console.log('Delete action')}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="gray"
          style={styles.searchIcon}
        />
      </View>
      <SwipeListView
        data={filteredDeliveries}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        swipeToOpenPercent={0}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rowFront: {
    backgroundColor: '#FFF',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 70,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  item: {
    padding: 20,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  recipient: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  pending: {
    color: 'orange',
  },
  delivered: {
    color: 'green',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    marginRight: -12,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },

  // search styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 10,
  },
});

export default Delivery;
