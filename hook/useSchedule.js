import {useState, useCallback} from 'react';
import axios from 'axios';
import config from '../config/config';

const useSchedule = () => {
  const [schedules, setSchedules] = useState({
    data: {
      schedule: {
        rawSchedules: [],
        groupedSchedules: {},
      },
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedules = useCallback(async teacherId => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${config.apiUrl}class-schedule/teacher/${teacherId}`,
      );

      setSchedules(response.data);

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch schedules');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
  };
};

export default useSchedule;
