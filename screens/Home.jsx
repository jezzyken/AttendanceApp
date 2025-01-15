import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import {Surface, Avatar, IconButton, Badge} from 'react-native-paper';
import useSchedule from '../hook/useSchedule';
import moment from 'moment';
import useNotificationLogs from '../hook/useNotificationLogs';

const getRandomColor = () => {
  const colors = ['#FF7B7B', '#FFB74D', '#81C784', '#64B5F6', '#BA68C8'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Dashboard = ({navigation, route}) => {
  const {teacherId} = route.params;
  const {
    schedules,
    loading: scheduleLoading,
    error: scheduleError,
    fetchSchedules,
  } = useSchedule();
  const {
    notificationLogs,
    loading: notificationLoading,
    error: notificationError,
    fetchNotificationLogs,
    refetchNotificationLogs,
  } = useNotificationLogs();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('schedule');

  const today = moment().format('dddd');
  const todaySchedules =
    schedules?.data?.schedule?.groupedSchedules[today] || [];

  useEffect(() => {
    if (teacherId) {
      fetchSchedules(teacherId);
      fetchNotificationLogs(teacherId);
    }
  }, [teacherId, fetchSchedules, fetchNotificationLogs]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchSchedules(teacherId),
        refetchNotificationLogs(teacherId),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  const teacherData = schedules?.data?.schedule?.rawSchedules?.[0]?.teacher;

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getTotalStudents = () => {
    const rawSchedules = schedules?.data?.schedule?.rawSchedules || [];
    const uniqueStudents = new Set();
    rawSchedules.forEach(schedule => {
      schedule.students.forEach(student => {
        uniqueStudents.add(student._id);
      });
    });
    return uniqueStudents.size;
  };

  const getTotalClassesToday = () => {
    const today = moment().format('dddd');
    return schedules?.data?.schedule?.groupedSchedules[today]?.length || 0;
  };

  const formatTime = time => {
    return moment(time, 'HH:mm').format('hh:mm A');
  };

  const NotificationLogItem = ({item}) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <Text style={styles.attendanceDate}>
          {moment(item.attendanceDate).format('MMM DD, YYYY')}
        </Text>
      </View>

      <View style={styles.studentDetails}>
        <Text style={styles.detailText}>
          {item.studentId} • {item.studentSection}
        </Text>
        <Text style={styles.detailText}>
          {item.subject} • {item.classSection} • {item.classTime}
        </Text>
      </View>

      <Text style={styles.message} numberOfLines={2}>
        {item.message}
      </Text>

      <View style={styles.emailStatus}>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: item.emailSent ? '#E8F5E9' : '#FFEBEE'},
          ]}>
          <Text
            style={[
              styles.statusText,
              {color: item.emailSent ? '#2E7D32' : '#C62828'},
            ]}>
            {item.emailSent ? 'Email Sent' : 'Email Failed'}
          </Text>
        </View>
        {item.emailSent && (
          <Text style={styles.emailTime}>
            {moment(item.emailSentAt).format('hh:mm A')}
          </Text>
        )}
      </View>
    </View>
  );


  const renderContent = () => {
    if (selectedTab === 'schedule') {
      if (scheduleLoading) {
        return <Text style={styles.loadingText}>Loading schedules...</Text>;
      }
      if (scheduleError) {
        return <Text style={styles.errorText}>{scheduleError}</Text>;
      }
      return (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AllSchedules', {
                  schedules: schedules?.data?.schedule?.groupedSchedules,
                })
              }>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={todaySchedules}
            renderItem={renderScheduleItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scheduleContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No classes scheduled for today
              </Text>
            }
          />
        </>
      );
    } else {
      if (notificationLoading) {
        return (
          <Text style={styles.loadingText}>Loading notification logs...</Text>
        );
      }
      if (notificationError) {
        return <Text style={styles.errorText}>{notificationError}</Text>;
      }

      return (
        <FlatList
          data={notificationLogs.logs}
          renderItem={({item}) => <NotificationLogItem item={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingVertical: 8}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notification logs found</Text>
          }
        />
      );
    }
  };

  const renderScheduleItem = ({item}) => (
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
              {item.subject.subjectName}
            </Text>
            <View style={styles.codeContainer}>
              <Text style={styles.courseCode}>{item.section}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.scheduleTime}>
              {`${formatTime(item.startTime)} - ${formatTime(item.endTime)}`}
            </Text>
            <Text style={styles.studentCount}>
              {item.students.length} Student
              {item.students.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (!teacherData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No teacher data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <Surface style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Avatar.Text
                size={48}
                label={getInitials(
                  teacherData.user.firstName,
                  teacherData.user.lastName,
                )}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <View style={styles.userInfo}>
                <Text style={styles.greeting}>Good Day!</Text>
                <Text style={styles.name}>
                  Teacher {teacherData.user.firstName}
                </Text>
                <Text
                  style={styles.department}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {teacherData.department.name}
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <View>
                <IconButton
                  icon="bell"
                  size={24}
                  onPress={() => setSelectedTab('notifications')}
                  style={styles.iconButton}
                />
                {notificationLogs.length > 0 && (
                  <Badge size={16} style={styles.notificationBadge}>
                    {notificationLogs.length}
                  </Badge>
                )}
              </View>
            </View>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'schedule' && styles.activeTab,
              ]}
              onPress={() => setSelectedTab('schedule')}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'schedule' && styles.activeTabText,
                ]}>
                Schedule
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'notifications' && styles.activeTab,
              ]}
              onPress={() => setSelectedTab('notifications')}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'notifications' && styles.activeTabText,
                ]}>
                Absence Logs
              </Text>
            </TouchableOpacity>
          </View>
        </Surface>

        <View style={styles.statsContainer}>
          <Surface style={styles.statCard}>
            <Text style={styles.statNumber}>{getTotalStudents()}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </Surface>
          <Surface style={styles.statCard}>
            <Text style={styles.statNumber}>{getTotalClassesToday()}</Text>
            <Text style={styles.statLabel}>Classes Today</Text>
          </Surface>
        </View>

        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    color: 'red',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    marginBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    elevation: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  header: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#8B0000',
  },
  avatarLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
  },
  name: {
    fontSize: 20,
    color: '#2D3436',
    fontWeight: '500',
  },
  department: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
  },
  seeAllButton: {
    color: '#4A90E2',
    fontWeight: '600',
    fontSize: 14,
  },
  scheduleContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 20,
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
    textTransform: 'capitalize',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#757575',
  },
  studentCount: {
    fontSize: 14,
    color: '#757575',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#636E72',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636E72',
  },
  activeTabText: {
    color: '#4A90E2',
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#4A90E2',
  },
  notificationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  statLabel: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 4,
  },
  notificationContent: {
    padding: 20,
    paddingTop: 0,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0, // Override default margin
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF4C4C',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentDetails: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
  messageText: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 4,
  },
  logDetails: {
    marginTop: 8,
  },
  summaryStats: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statInfo: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 4,
  },
  emailTime: {
    fontSize: 11,
    color: '#636E72',
    marginLeft: 8,
  },
  logItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  attendanceDate: {
    fontSize: 14,
    color: '#636E72',
  },
  studentDetails: {
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 12,
  },
  emailStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emailTime: {
    fontSize: 12,
    color: '#636E72',
    marginLeft: 8,
  },
});
export default Dashboard;
