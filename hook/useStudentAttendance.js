import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import config from '../config/config';
import moment from 'moment';
import {SendDirectSms} from 'react-native-send-direct-sms';

const AttendanceStatus = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

const useStudentAttendance = (classId, selectedDate, className) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [existingAttendanceRecord, setExistingAttendanceRecord] =
    useState(null);

  const fetchClassSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${config.apiUrl}class-schedule/${classId}`,
      );

      if (response.data.data.schedule) {
        const classSchedule = response.data.data.schedule;
        setStudents(classSchedule.students);

        const existingAttendance = await checkExistingAttendance(
          classId,
          selectedDate,
        );

        if (!existingAttendance) {
          const initialAttendance = {};
          classSchedule.students.forEach(student => {
            initialAttendance[student._id] = null;
          });
          setAttendance(initialAttendance);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch class schedule');
    } finally {
      setLoading(false);
    }
  }, [classId, selectedDate, checkExistingAttendance]);

  const updateAttendance = useCallback((studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  }, []);

  const validateAttendance = useCallback(() => {
    const unmarkedStudents = Object.values(attendance).filter(
      status => status === null,
    );
    return unmarkedStudents.length === 0;
  }, [attendance]);

  const updateExistingAttendance = useCallback(
    async (attendanceId, attendanceRecords) => {
      try {
        setSubmitLoading(true);

        const response = await axios.put(
          `${config.apiUrl}attendance/${attendanceId}`,
          {
            attendanceRecords,
          },
        );

        if (response.data.status === 'success') {
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error updating attendance:', error);
        throw error;
      } finally {
        setSubmitLoading(false);
      }
    },
    [],
  );

  const sendAbsenceNotification = useCallback(
    async student => {
      try {
        const parentName = student?.parentName || 'Parent/Guardian';
        const studentName =
          `${student.user.firstName} ${student.user.lastName}` || 'Student';

        if (student.parentNo) {
          const message = `Dear ${parentName}, This is to inform you that your child, ${studentName}, was marked absent for ${className} on ${moment(
            selectedDate,
          ).format('MMMM DD, YYYY')}.`;

          const sms = await SendDirectSms(student.parentNo, message);
          console.log(sms);
          console.log(message);
        }
      } catch (error) {
        console.error('Error sending SMS notification:', error);
      }
    },
    [className, selectedDate],
  );

  const submitAttendance = useCallback(
    async scheduleData => {
      try {
        setSubmitLoading(true);

        if (!validateAttendance()) {
          throw new Error('Please mark attendance for all students');
        }

        const attendanceRecords = students.map(student => ({
          student: student._id,
          status: attendance[student._id] || AttendanceStatus.ABSENT,
        }));

        for (const student of students) {
          if (attendance[student._id] === AttendanceStatus.ABSENT) {
            await sendAbsenceNotification(student);
          }
        }

        if (existingAttendanceRecord) {
          return await updateExistingAttendance(
            existingAttendanceRecord._id,
            attendanceRecords,
          );
        } else {
          const attendanceData = {
            classSchedule: scheduleData._id,
            attendanceDate: moment(selectedDate).format('YYYY-MM-DD'),
            daysOfWeek: moment(selectedDate).format('dddd'),
            attendanceRecords,
          };

          const createResponse = await axios.post(
            `${config.apiUrl}attendance`,
            attendanceData,
          );

          if (createResponse.data.status === 'success') {
            return true;
          }
        }

        return false;
      } catch (error) {
        console.error('Error submitting attendance:', error);
        throw error;
      } finally {
        setSubmitLoading(false);
      }
    },
    [
      attendance,
      validateAttendance,
      existingAttendanceRecord,
      selectedDate,
      students,
      updateExistingAttendance,
      sendAbsenceNotification,
    ],
  );

  const checkExistingAttendance = useCallback(
    async (classScheduleId, date) => {
      try {
        const response = await axios.get(`${config.apiUrl}attendance/check`, {
          params: {
            classScheduleId,
            date: moment(date).format('YYYY-MM-DD'),
          },
        });

        if (response.data.data.exists && response.data.data.attendance) {
          const existingData = response.data.data.attendance;
          console.log(existingData);
          setExistingAttendanceRecord(existingData);

          const existingAttendance = {};
          existingData.attendanceRecords.forEach(record => {
            const studentId = record.student._id;
            existingAttendance[record.student._id] = record.status;
          });
          setAttendance(existingAttendance);
          return true;
        }
        setExistingAttendanceRecord(null);

        if (students.length > 0) {
          const initialAttendance = {};
          students.forEach(student => {
            initialAttendance[student._id] = null;
          });
          setAttendance(initialAttendance);
        }
        return false;
      } catch (error) {
        console.error('Error checking attendance:', error);
        return false;
      }
    },
    [students],
  );

  const getAttendanceStats = useCallback(
    async (startDate, endDate) => {
      try {
        const response = await axios.get(
          `${config.apiUrl}attendance/stats/${classId}`,
          {
            params: {
              startDate: moment(startDate).format('YYYY-MM-DD'),
              endDate: moment(endDate).format('YYYY-MM-DD'),
            },
          },
        );
        return response.data.data.stats;
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
        throw error;
      }
    },
    [classId],
  );

  useEffect(() => {
    fetchClassSchedule();
  }, [fetchClassSchedule]);

  const resetAttendance = useCallback(() => {
    const initialAttendance = {};
    students.forEach(student => {
      initialAttendance[student._id] = null;
    });
    setAttendance(initialAttendance);
    setExistingAttendanceRecord(null);
  }, [students]);

  return {
    students,
    loading,
    error,
    attendance,
    submitLoading,
    existingAttendanceRecord,
    updateAttendance,
    submitAttendance,
    checkExistingAttendance,
    getAttendanceStats,
    resetAttendance,
    AttendanceStatus,
    refetchClassSchedule: fetchClassSchedule,
    validateAttendance,
    sendAbsenceNotification,
  };
};

export default useStudentAttendance;
