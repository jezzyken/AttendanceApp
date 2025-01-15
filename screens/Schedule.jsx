import React, {useState, useRef, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import useSchedule from '../hook/useSchedule';

const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const windowHeight = Dimensions.get('window').height;

const CalendarScreen = ({route}) => {
  const {teacherId} = route.params;
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDaySchedules, setSelectedDaySchedules] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const scrollY = useRef(new Animated.Value(0)).current;
  const {schedules, loading, error, fetchSchedules} = useSchedule();

  useEffect(() => {
    if (teacherId) {
      fetchSchedules(teacherId);
    }
  }, [teacherId]);

  useEffect(() => {
    if (schedules?.data?.schedule) {
      const marks = generateMarkedDates(schedules.data.schedule.rawSchedules);
      setMarkedDates(marks);
    }
  }, [schedules]);

  const generateMarkedDates = scheduleData => {
    const marks = {};
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    scheduleData.forEach(schedule => {
      schedule.weekDays.forEach(day => {
        for (let i = 1; i <= 31; i++) {
          const date = new Date(currentYear, currentMonth, i);
          if (date.toLocaleDateString('en-US', {weekday: 'long'}) === day) {
            const dateString = date.toISOString().split('T')[0];
            if (!marks[dateString]) {
              marks[dateString] = {marked: true, dotColor: '#4CAF50'};
            }
          }
        }
      });
    });

    return marks;
  };

  const onDayPress = day => {
    const date = day.dateString;
    setSelectedDate(date);
    const selectedDayName = moment(date).format('dddd');
    
    const daySchedules = schedules?.data?.schedule?.groupedSchedules[selectedDayName] || [];
    setSelectedDaySchedules(daySchedules);
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
        navigation.navigate('StudentList', {
          classId: item._id,
          classSchedule: item,
        })
      }>
      <View style={styles.courseInfo}>
        <Avatar.Text
          size={45}
          label={item.subject.subjectName.substring(0, 2).toUpperCase()}
          style={[styles.avatar, {backgroundColor: getRandomColor()}]}
        />
        <View style={styles.courseDetails}>
          <View style={styles.courseNameContainer}>
            <Text style={styles.courseName} numberOfLines={1}>
              {item.course.courseName}
            </Text>
            <View style={styles.codeContainer}>
              <Text style={styles.courseCode}>{item.section}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.scheduleTime}>
              {moment(item.startTime, 'HH:mm').format('hh:mm A')} - {moment(item.endTime, 'HH:mm').format('hh:mm A')}
            </Text>
            <Text style={styles.studentCount}>
              {item.students.length} Student{item.students.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.subjectName}>{item.subject.subjectName}</Text>
        </View>
      </View>
    </Pressable>
  );

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
            ...markedDates,
            [selectedDate]: {
              ...markedDates[selectedDate],
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
          }}
        />
      </Surface>
    </Animated.View>
  );

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

  const ListHeaderComponent = () =>
    selectedDate ? (
      <View style={styles.headerContent}>
        <Text style={styles.dateHeader}>
          {moment(selectedDate).format('dddd, MMMM D, YYYY')}
        </Text>
        <Text style={styles.classCount}>
          {selectedDaySchedules.length} {selectedDaySchedules.length === 1 ? 'Class' : 'Classes'}
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
        data={selectedDaySchedules}
        keyExtractor={item => item._id}
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
    marginTop: -10,
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
