import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import useStudentAttendance from '../hook/useStudentAttendance.js';
import moment from 'moment';

const StudentListScreen = ({route}) => {
  const {classId, classSchedule, selectedDate} = route.params;
  const navigation = useNavigation();
  const {
    students,
    loading,
    error,
    attendance,
    submitLoading,
    existingAttendanceRecord,
    updateAttendance,
    submitAttendance,
    checkExistingAttendance,
    AttendanceStatus,
    validateAttendance,
    resetAttendance,
    sendAbsenceNotification,
  } = useStudentAttendance(
    classId,
    selectedDate,
    classSchedule?.subject?.subjectName,
  );

  useEffect(() => {
    if (classId && selectedDate) {
      checkExistingAttendance(classId, selectedDate);
    }
  }, [classId, selectedDate, checkExistingAttendance]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            Alert.alert(
              'Reset Attendance',
              'Are you sure you want to reset all attendance marks?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Reset',
                  style: 'destructive',
                  onPress: resetAttendance,
                },
              ],
            );
          }}>
          <Icon name="refresh-outline" size={24} color="#007BFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, resetAttendance]);

  const renderStudentItem = useCallback(
    ({item, index}) => (
      <View style={styles.studentItem}>
        <View style={styles.studentMainInfo}>
          <View style={styles.indexContainer}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <Image
            source={{
              uri: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
            }}
            style={styles.studentImage}
          />
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {`${item.user.lastName}, ${item.user.firstName}`}
            </Text>
            <Text style={styles.middleName}>{item.user.middleName}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{`ID: ${item.studentId}`}</Text>
              </View>
              <View style={[styles.badge, styles.sectionBadge]}>
                <Text style={styles.badgeText}>
                  {item.level} - {item.section}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.attendanceButtons}>
          {Object.values(AttendanceStatus).map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.attendanceButton,
                attendance[item._id] === status && styles[`${status}Button`],
              ]}
              onPress={() => updateAttendance(item._id, status)}>
              <Text style={styles.attendanceButtonText}>
                {status === 'present'
                  ? 'P'
                  : status === 'late'
                  ? 'L'
                  : status === 'absent'
                  ? 'A'
                  : status === 'excused'
                  ? 'E'
                  : status.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [attendance, updateAttendance, AttendanceStatus],
  );

  const renderSubmitButton = () => (
    <TouchableOpacity
      style={[
        styles.submitButton,
        submitLoading && styles.submitButtonDisabled,
      ]}
      onPress={handleSubmitAttendance}
      disabled={submitLoading}>
      {submitLoading ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <>
          <Icon
            name={
              existingAttendanceRecord
                ? 'create-outline'
                : 'checkmark-circle-outline'
            }
            size={24}
            color="#FFF"
          />
          <Text style={styles.submitButtonText}>
            {existingAttendanceRecord
              ? 'Update Attendance'
              : 'Submit Attendance'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
  const ListHeader = () => (
    <View style={styles.scheduleInfo}>
      <View style={styles.scheduleHeader}>
        <Icon name="book-outline" size={18} color="#007BFF" />
        <Text style={styles.subjectName}>
          {classSchedule.subject.subjectName}
        </Text>
      </View>
      <View style={styles.scheduleDetails}>
        <View style={styles.detailItem}>
          <Icon name="school-outline" size={18} color="#666" />
          <Text style={styles.detailText}>
            {classSchedule.course.courseName}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="people-outline" size={18} color="#666" />
          <Text style={styles.detailText}>{classSchedule.section}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="time-outline" size={18} color="#666" />
          <Text style={styles.detailText}>
            {moment(classSchedule.startTime, 'HH:mm').format('hh:mm A')} -{' '}
            {moment(classSchedule.endTime, 'HH:mm').format('hh:mm A')}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="calendar-outline" size={18} color="#666" />
          <Text style={styles.detailText}>
            {moment(selectedDate).format('dddd, MMMM D, YYYY')}
          </Text>
        </View>
      </View>
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#4CAF50'}]} />
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#FFC107'}]} />
            <Text style={styles.legendText}>Late</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#F44336'}]} />
            <Text style={styles.legendText}>Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#007BFF'}]} />
            <Text style={styles.legendText}>Excused</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const keyExtractor = useCallback(item => item._id.toString(), []);

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="people-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>No students found</Text>
      <Text style={styles.emptySubText}>
        There are no students enrolled in this class
      </Text>
    </View>
  );

  const handleSubmitAttendance = async () => {
    try {
      if (!validateAttendance()) {
        Alert.alert(
          'Incomplete Attendance',
          'Please mark attendance for all students before submitting.',
        );
        return;
      }

      // Show confirmation dialog
      Alert.alert(
        'Confirm Attendance',
        existingAttendanceRecord
          ? 'Are you sure you want to update the attendance?'
          : 'Are you sure you want to submit the attendance?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                const absentStudents = students.filter(
                  student =>
                    attendance[student._id] === AttendanceStatus.ABSENT,
                );

                if (absentStudents.length > 0) {
                  for (const student of absentStudents) {
                    try {
                      Alert.alert(
                        'Sending Notifications',
                        `Sending SMS notifications to parents of ${absentStudents.length} absent student(s).`,
                      );
                      // await sendAbsenceNotification(student);
                    } catch (smsError) {
                      console.error(
                        'SMS sending failed for student:',
                        student._id,
                        smsError,
                      );
                    }
                  }
                }

                const success = await submitAttendance({
                  _id: classSchedule._id,
                  date: selectedDate,
                });

                if (success) {
                  Alert.alert(
                    'Success',
                    existingAttendanceRecord
                      ? 'Attendance updated successfully'
                      : 'Attendance submitted successfully',
                    [
                      {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                      },
                    ],
                  );
                } else {
                  Alert.alert(
                    'Error',
                    'Failed to process attendance. Please try again.',
                  );
                }
              } catch (error) {
                if (error.response?.status === 400) {
                  Alert.alert('Error', error.response.data.message);
                } else {
                  Alert.alert(
                    'Error',
                    'An unexpected error occurred. Please try again.',
                  );
                }
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error handling attendance:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={60} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchStudents()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={24} color="#007BFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Student Attendance</Text>
            <Text style={styles.headerSubtitle}>
              {students.length} Students
            </Text>
          </View>
        </View>

        <FlatList
          data={students}
          ListHeaderComponent={ListHeader}
          keyExtractor={keyExtractor}
          renderItem={renderStudentItem}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.bottomContainer}>{renderSubmitButton()}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitleContainer: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  scheduleInfo: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  scheduleDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginLeft: 10,
  },
  legendContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  studentItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  studentMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007BFF',
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  middleName: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#E3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 2,
  },
  sectionBadge: {
    backgroundColor: '#E8F5E9',
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
  },
  attendanceButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  attendanceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  presentButton: {
    backgroundColor: '#4CAF50',
  },
  lateButton: {
    backgroundColor: '#FFC107',
  },
  absentButton: {
    backgroundColor: '#F44336',
  },
  excusedButton: {
    backgroundColor: '#007BFF',
  },
  attendanceButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButton: {
    backgroundColor: '#8B0000',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },

  smsStatusContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smsStatusText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default StudentListScreen;
