// hooks/useFetchTransactions.js
import {useState, useEffect} from 'react';
import axios from 'axios';
import config from '../config/config';

const useFetchTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/sales`);
        setTransactions(response.data.result);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError(err);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return {transactions, loading, error};
};

export default useFetchTransactions;
