import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  Pressable
} from 'react-native';
import {Surface, Avatar} from 'react-native-paper';

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
const flatAttendanceData = Object.values(attendanceData).flat();



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

const getRandomColor = () => {
  const colors = ['#FF7B7B', '#FFB74D', '#81C784', '#64B5F6', '#BA68C8'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        {/* Header */}
        <Surface style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Avatar.Text
                size={48}
                label="TJ"
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <View style={styles.userInfo}>
                <Text style={styles.greeting}>Good Day!</Text>
                <Text style={styles.name}>Teacher Ken</Text>
                <Text style={styles.department}>IT Department</Text>
              </View>
              <View></View>
            </View>
          </View>
        </Surface>

        {/* Dashboard Stats */}
        <View style={styles.statsContainer}>
          <Surface style={styles.statCard}>
            <Text style={styles.statNumber}>125</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </Surface>
          <Surface style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Classes Today</Text>
          </Surface>
        </View>

        {/* Dashboard Menu */}
        {/* <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.menuContainer}
          contentContainerStyle={styles.menuContent}
        >
          {['Schedule', 'Students', 'Upcoming Schedule'].map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.menuGradient}
              >
                <Text style={styles.menuText}>{item}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView> */}

        {/* Upcoming Schedule Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scheduleContent}>
          {[1, 2, 3, 4].map((item, index) => (
            <Surface key={index} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <View style={styles.courseContainer}>
                  <Avatar.Text
                    size={40}
                    label="BS"
                    style={styles.courseAvatar}
                    labelStyle={styles.courseAvatarLabel}
                  />
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseCode}>BSIT</Text>
                    <Text style={styles.courseId}>ITC123</Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Upcoming</Text>
                </View>
              </View>
              <View style={styles.scheduleDetails}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeLabel}>Time:</Text>
                  <Text style={styles.timeSlot}>8:00am to 9:00m</Text>
                </View>
                <View style={styles.studentContainer}>
                  <Text style={styles.studentCount}>40 Students</Text>
                </View>
              </View>
            </Surface>
          ))}
        </ScrollView> */}

        <FlatList
          data={flatAttendanceData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scheduleContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
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
    backgroundColor: '#4A90E2',
  },
  avatarLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
  },
  department: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '500',
  },
  name: {
    fontSize: 20,
    color: '#2D3436',
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
  menuContainer: {
    marginBottom: 20,
  },
  menuContent: {
    paddingHorizontal: 20,
  },
  menuItem: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuGradient: {
    padding: 16,
    minWidth: 130,
    alignItems: 'center',
  },
  menuText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
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
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
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
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseAvatar: {
    backgroundColor: '#4A90E2',
    marginRight: 12,
  },
  courseAvatarLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  courseInfo: {
    flexDirection: 'column',
  },
  courseCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  courseId: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#E1F5FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#0288D1',
    fontSize: 12,
    fontWeight: '600',
  },
  scheduleDetails: {
    marginTop: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
    marginRight: 8,
  },
  timeSlot: {
    fontSize: 14,
    color: '#2D3436',
    fontWeight: '600',
  },
  studentContainer: {
    backgroundColor: '#F5F7FA',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  studentCount: {
    fontSize: 13,
    color: '#636E72',
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

export default Dashboard;
