// hooks/useNotificationLogs.js
import {useState, useCallback} from 'react';
import config from '../config/config';
import axios from 'axios';

const useNotificationLogs = () => {
  const [notificationLogs, setNotificationLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotificationLogs = useCallback(async teacherId => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${config.apiUrl}notification-log/teacher/${teacherId}`,
      );
      setNotificationLogs(response.data);
    } catch (error) {
      console.error('Error fetching notification logs:', error);
      setError(error.message || 'Failed to fetch notification logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchNotificationLogs = useCallback(
    async teacherId => {
      return fetchNotificationLogs(teacherId);
    },
    [fetchNotificationLogs],
  );

  return {
    notificationLogs,
    loading,
    error,
    fetchNotificationLogs,
    refetchNotificationLogs,
  };
};

export default useNotificationLogs;
