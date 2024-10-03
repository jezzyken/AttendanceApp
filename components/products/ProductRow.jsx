import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import ProductCardView from './ProductCardView';
import useFetch from '../../hook/useFetch';

const ProductRow = ({fetchCartCount }) => {
  const {data, isLoading, error} = useFetch();

  return (
    <View View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size={40} color="red" />
      ) : error ? (
        <Text>Something went wrong</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item._id}
          renderItem={({item}) => <ProductCardView item={item} fetchCartCount={fetchCartCount }/>}
          numColumns={2}
        />
      )}
    </View>
  );
};

export default ProductRow;

const styles = StyleSheet.create({
  container: {
    marginBottom: 100
  },
});
