import {useState, useEffect} from 'react';
import axios from 'axios';
import config from '../config/config';

const useFetch = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    console.log(`${config.apiUrl}/products`)

    try {
      const response = await axios.get(`${config.apiUrl}/products`);
      setData(response.data.result);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setError(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return {data, isLoading, error, refetch};
};

export default useFetch;
