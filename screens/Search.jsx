import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Surface, Avatar} from 'react-native-paper';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const attendanceData = {
  '2024-10-10': [
    {
      id: '1',
      courseName: 'Introduction to Computing',
      courseCode: 'ITC123',
      scheduleTime: '10:00am - 12:00pm',
      noOfStudents: 40,
    },
    {
      id: '2',
      courseName: 'Data Structures',
      courseCode: 'DSA234',
      scheduleTime: '1:00pm - 3:00pm',
      noOfStudents: 35,
    },
  ],
  '2024-10-15': [
    {
      id: '3',
      courseName: 'Database Management Systems',
      courseCode: 'DBM345',
      scheduleTime: '9:00am - 11:00am',
      noOfStudents: 45,
    },
  ],
  '2024-10-20': [
    {
      id: '4',
      courseName: 'Software Engineering',
      courseCode: 'SWE456',
      scheduleTime: '2:00pm - 4:00pm',
      noOfStudents: 30,
    },
    {
      id: '5',
      courseName: 'Operating Systems',
      courseCode: 'OS567',
      scheduleTime: '4:00pm - 6:00pm',
      noOfStudents: 38,
    },
    {
      id: '6',
      courseName: 'Operating Systems',
      courseCode: 'OS567',
      scheduleTime: '4:00pm - 6:00pm',
      noOfStudents: 38,
    },
    {
      id: '7',
      courseName: 'Operating Systems',
      courseCode: 'OS567',
      scheduleTime: '4:00pm - 6:00pm',
      noOfStudents: 38,
    },
    {
      id: '8',
      courseName: 'Operating Systems',
      courseCode: 'OS567',
      scheduleTime: '4:00pm - 6:00pm',
      noOfStudents: 38,
    },
    {
      id: '9',
      courseName: 'Operating Systems',
      courseCode: 'OS567',
      scheduleTime: '4:00pm - 6:00pm',
      noOfStudents: 38,
    },
    {
      id: '10',
      courseName: 'Operating Systems',
      courseCode: 'OS567',
      scheduleTime: '4:00pm - 6:00pm',
      noOfStudents: 38,
    },
    {
      id: '11',
      courseName: 'Operating Systems',
      courseCode: 'OS567',
      scheduleTime: '4:00pm - 6:00pm',
      noOfStudents: 38,
    },
    {
      id: '12',
      courseName: 'Operating Systems',
      courseCode: 'OS567',
      scheduleTime: '4:00pm - 6:00pm',
      noOfStudents: 38,
    },
  ],
};

const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const windowHeight = Dimensions.get('window').height;

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [attendance, setAttendance] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const onDayPress = day => {
    const date = day.dateString;
    setSelectedDate(date);
    setAttendance(attendanceData[date] || []);
  };

  const getRandomColor = () => {
    const colors = ['#FF7B7B', '#FFB74D', '#81C784', '#64B5F6', '#BA68C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>
        No classes scheduled for this date
      </Text>
    </View>
  );

  const renderItem = ({item}) => (
    <Pressable
      style={styles.courseCard}
      onPress={() =>
        navigation.navigate('StudentList', {students: getStudents(item.id)})
      }>
      <View style={styles.courseInfo}>
        <Avatar.Text
          size={45}
          label={item.courseCode.substring(0, 2)}
          style={[styles.avatar, {backgroundColor: getRandomColor()}]}
        />
        <View style={styles.courseDetails}>
          <View style={styles.courseNameContainer}>
            <Text style={styles.courseName} numberOfLines={1}>
              {item.courseName}
            </Text>
            <View style={styles.codeContainer}>
              <Text style={styles.courseCode}>{item.courseCode}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.scheduleTime}>{item.scheduleTime}</Text>
            <Text style={styles.studentCount}>
              {item.noOfStudents} Students
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const getStudents = courseId => {
    const studentsData = {
      1: [
        {
          id: '1',
          name: 'Alice',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '2',
          name: 'Bob',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
        {
          id: '3',
          name: 'Eve',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '4',
          name: 'Frank',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
        {
          id: '5',
          name: 'Grace',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '6',
          name: 'Hank',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
        {
          id: '7',
          name: 'Ivy',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '8',
          name: 'Jack',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
        {
          id: '9',
          name: 'Kara',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '10',
          name: 'Leo',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
      ],
      2: [
        {
          id: '11',
          name: 'Charlie',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '12',
          name: 'David',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
        {
          id: '13',
          name: 'Mia',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '14',
          name: 'Noah',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
        {
          id: '15',
          name: 'Olivia',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '16',
          name: 'Paul',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
        {
          id: '17',
          name: 'Quinn',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '18',
          name: 'Ryan',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
        {
          id: '19',
          name: 'Sophia',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg4iLBgHm-o1wj3ckRUfGw8aEjUZcUByOe-g&s',
        },
        {
          id: '20',
          name: 'Tom',
          imageUrl:
            'https://ogre.natalie.mu/media/pp/reona04/photo246.jpg?imwidth=1200&imdensity=1',
        },
      ],
    };

    return studentsData[courseId] || [];
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          opacity: headerOpacity,
        },
      ]}>
      <Surface style={styles.calendarContainer}>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          onDayPress={onDayPress}
          markedDates={{
            '2024-10-10': {marked: true, dotColor: '#4CAF50'},
            '2024-10-15': {marked: true, dotColor: '#FFA726'},
            '2024-10-20': {marked: true, dotColor: '#F44336'},
            [selectedDate]: {
              selected: true,
              selectedColor: '#E3F2FD',
              selectedTextColor: '#1976D2',
            },
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#9E9E9E',
            selectedDayBackgroundColor: '#E3F2FD',
            selectedDayTextColor: '#1976D2',
            todayTextColor: '#1976D2',
            todayBackgroundColor: '#E3F2FD',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#1976D2',
            selectedDotColor: '#1976D2',
            arrowColor: '#1976D2',
            monthTextColor: '#1976D2',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textMonthFontWeight: '700',
            textDayHeaderFontSize: 14,
            'stylesheet.calendar.header': {
              header: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 6,
                alignItems: 'center',
                height: 40,
              },
            },
          }}
        />
      </Surface>
    </Animated.View>
  );

  const ListHeaderComponent = () =>
    selectedDate ? (
      <View style={styles.headerContent}>
        <Text style={styles.dateHeader}>
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <Text style={styles.classCount}>
          {attendance.length} {attendance.length === 1 ? 'Class' : 'Classes'}
        </Text>
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      {renderHeader()}

      <Animated.FlatList
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollViewContent,
          {
            paddingTop: HEADER_MAX_HEIGHT,
            minHeight: windowHeight - HEADER_MIN_HEIGHT,
          },
        ]}
        data={attendance}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={selectedDate ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        bounces={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    zIndex: 1,
  },
  calendarContainer: {
    elevation: 0,
    backgroundColor: '#ffffff',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 1,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },

  headerContent: {
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  dateHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d4150',
    marginBottom: 4,
  },
  classCount: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  courseDetails: {
    flex: 1,
  },
  courseNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d4150',
    flex: 1,
    marginRight: 8,
  },
  codeContainer: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  courseCode: {
    fontSize: 10,
    fontWeight: '600',
    color: '#757575',
  },
  timeContainer: {
    flexDirection: 'column',
    marginTop: -10
  },
  icon: {
    marginRight: 4,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#757575',
    marginRight: 12,
  },
  studentCount: {
    fontSize: 14,
    color: '#757575',
  },
});

export default CalendarScreen;
