import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductCardView = ({item, fetchCartCount}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [variantName, setSelectedVariantName] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const slideAnim = useState(new Animated.Value(300))[0];
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (selectedItem) {
      if (selectedItem.variants.length > 0) {
        setSelectedVariant(selectedItem.variants[0]._id);
        setSelectedPrice(selectedItem.variants[0].sellingPrice);
        setTotalPrice(selectedItem.variants[0].sellingPrice * quantity);
        setSelectedVariantName(selectedItem.variants[0].name);
      } else {
        setSelectedVariant(null);
        setSelectedPrice(selectedItem.sellingPrice);
        setTotalPrice(selectedItem.sellingPrice * quantity);
      }
    }
  }, [selectedItem]);

  useEffect(() => {
    if (selectedPrice !== null && quantity > 0) {
      setTotalPrice(selectedPrice * quantity);
    }
  }, [selectedPrice, quantity]);

  const saveCartItems = async items => {
    try {
      await AsyncStorage.setItem('@cart_items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart items to AsyncStorage:', error);
    }
  };

  const handleButtonPress = () => {
    setSelectedItem(item);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedVariant(null);
    setSelectedPrice(null);
    setSelectedVariantName(null);
    setQuantity(1);
    setTotalPrice(0);
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleVariantPress = (variant, price, name) => {
    console.log(variant, price, name);
    setSelectedVariant(variant);
    setSelectedVariantName(name);
    setSelectedPrice(parseFloat(price).toFixed(2));
    setTotalPrice((price * quantity).toFixed(2));
  };

  const handleIncrement = () => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + 1;
      setTotalPrice((selectedPrice * newQuantity).toFixed(2));
      return newQuantity;
    });
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity > 1 ? prevQuantity - 1 : 1;
      setTotalPrice((selectedPrice * newQuantity).toFixed(2));
      return newQuantity;
    });
  };

  const handleConfirm = async () => {
    if (selectedItem) {
      const newItem = {
        product: selectedItem._id,
        name: selectedItem.name,
        variant: selectedVariant,
        variantName: variantName,
        price: selectedPrice, // Keep the unit price
        quantity: quantity,
        image: selectedItem.image,
      };

      try {
        const jsonValue = await AsyncStorage.getItem('@cart_items');
        let storedCartItems = [];

        if (jsonValue !== null) {
          storedCartItems = JSON.parse(jsonValue);
        }

        const existingItemIndex = storedCartItems.findIndex(
          item =>
            item.product === newItem.product &&
            item.variant === newItem.variant,
        );

        if (existingItemIndex !== -1) {
          // Item already exists, update quantity and total price
          storedCartItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          storedCartItems.push(newItem);
        }

        // Save updated cart to AsyncStorage
        setCartItems(storedCartItems);
        await saveCartItems(storedCartItems);

        closeModal();
        fetchCartCount();
      } catch (error) {
        console.error('Error updating cart items in AsyncStorage:', error);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', {item})}>
      <View style={styles.item}>
        <View style={styles.imageContainer}>
          <Image source={{uri: item.image}} style={styles.image} />
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>
          Price: {parseFloat(item.sellingPrice).toFixed(2)}
        </Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleButtonPress}>
          <Text style={styles.btnText}>Add to Cart</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
          animationType="none">
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {transform: [{translateY: slideAnim}]},
                ]}>
                {selectedItem && (
                  <>
                    <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                    {selectedItem.variants.length > 0 ? (
                      <ScrollView
                        horizontal
                        contentContainerStyle={styles.variantButtonContainer}>
                        {selectedItem.variants.map((variant, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.variantButton,
                              selectedVariant === variant._id &&
                                styles.variantButtonSelected,
                            ]}
                            onPress={() =>
                              handleVariantPress(
                                variant._id,
                                variant.sellingPrice,
                                variant.name,
                              )
                            }>
                            <Text
                              style={[
                                styles.variantButtonText,
                                selectedVariant === variant._id &&
                                  styles.variantButtonTextSelected,
                              ]}>
                              {variant.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    ) : (
                      <Text style={styles.noVariants}>
                        No variants available
                      </Text>
                    )}

                    <View style={styles.testContainer}>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={handleDecrement}>
                          <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={handleIncrement}>
                          <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.selectedPrice}>
                        Total: {parseFloat(totalPrice).toFixed(2)}
                      </Text>
                    </View>
                  </>
                )}
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={handleConfirm}>
                  <Text style={styles.btnText}>Confirm</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: 160,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  variantButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  variantButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantButtonSelected: {
    backgroundColor: '#FF5733',
  },
  variantButtonText: {
    color: '#000',
  },
  variantButtonTextSelected: {
    color: '#fff', // Change the text color when selected
  },
  noVariants: {
    fontSize: 16,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 16,
  },
  quantityButton: {
    borderWidth: 2,
    borderColor: '#A9A9A9',
    borderRadius: 5,
    border: '#A9A9A9',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#A9A9A9',
    fontSize: 18,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
    color: '#A9A9A9',
  },
  selectedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  addBtn: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },

  testContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  addBtn: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ProductCardView;
