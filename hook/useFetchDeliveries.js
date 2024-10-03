import {useState, useCallback} from 'react';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import config from '../config/config';

const useFetchDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/deliveries`);
      setDeliveries(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchDeliveries();
    }, []),
  );

  return {deliveries, loading, fetchDeliveries};
};

export default useFetchDeliveries;
