// screens/LoginScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import axios from 'axios';
import config from '../config/config';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${config.apiUrl}auth/login`, {
        email: email.trim(),
        password,
      });

      if (response.data?.data?.user) {
        navigation.replace('BottomNavigation', {
          teacherId: response.data.data.teacher._id,
        });
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Alert.alert('Login Failed', 'Invalid email or password');
          break;
        case 429:
          Alert.alert('Login Failed', 'Too many attempts. Please try again later');
          break;
        default:
          Alert.alert(
            'Login Failed',
            error.response.data?.message || 'An error occurred during login'
          );
      }
    } else if (error.request) {
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection.'
      );
    } else {
      Alert.alert('Error', 'An unexpected error occurred');
    }
    console.error('Login error:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
colors={['#8B0000', '#5E0A24']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <Animated.View 
              style={[
                styles.innerContainer,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.logoContainer}>
         
                <Text style={styles.title}>GIT Teacher</Text>
                <Text style={styles.subtitle}>Welcome back! Please login to your account</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Icon name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, emailError && styles.inputError]}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setEmailError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, passwordError && styles.inputError]}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setPasswordError('');
                    }}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity 
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}>
                    <Icon 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#666"
                    />
                  </TouchableOpacity>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}>
                  <LinearGradient
                    colors={isLoading ? ['#ccc', '#ccc'] : ['#800000', '#A93226']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.gradientButton}>
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.loginButtonText}>Login</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 45,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;