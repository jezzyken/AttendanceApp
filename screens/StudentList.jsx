import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const AttendanceStatus = {
  PRESENT: 'present',
  LATE: 'late',
  ABSENT: 'absent',
};

const StudentListScreen = ({route}) => {
  const {students} = route.params;
  const navigation = useNavigation();
  const [attendance, setAttendance] = useState({});

  const updateAttendance = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const renderStudentItem = useCallback(
    ({item}) => (
      <View style={styles.studentItem}>
        <Image source={{uri: item.imageUrl}} style={styles.studentImage} />
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.fullName}</Text>
          <Text style={styles.studentGrade}>{item.degree}</Text>
        </View>
        <View style={styles.attendanceButtons}>
          {Object.values(AttendanceStatus).map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.attendanceButton,
                attendance[item.id] === status && styles[`${status}Button`],
              ]}
              onPress={() => updateAttendance(item.id, status)}>
              <Text style={styles.attendanceButtonText}>
                {status.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [attendance],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);

  const ListEmptyComponent = () => (
    <View style={styles.emptyList}>
      <Text style={styles.emptyListText}>No students found</Text>
    </View>
  );

  const submitAttendance = () => {
    console.log('Submitting attendance:', attendance);
    // Here you would typically send this data to your backend
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color="#b8b6ad" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Attendance</Text>
      </View>
      <FlatList
        data={students}
        keyExtractor={keyExtractor}
        renderItem={renderStudentItem}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submitAttendance}>
        <Text style={styles.submitButtonText}>Submit Attendance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  studentItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  studentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentGrade: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  attendanceButtons: {
    flexDirection: 'row',
  },
  attendanceButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
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
  attendanceButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#777',
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007BFF', // Updated to a more modern blue color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StudentListScreen;
