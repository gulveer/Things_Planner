import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

const CurrentDate = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();

  return (
    <View>
      <Text
        style={{
          color: '#feabc7',
          fontWeight: 'bold',
          alignSelf: 'center',
          marginBottom: 5,
          marginTop: 10,
          fontSize: 16,
        }}>
        TODAY'S DATE: {`${day}/${month}/${year}`}
      </Text>
    </View>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const fetchTasks = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const tasksRef = firebase
          .database()
          .ref('tasks')
          .orderByChild('userId')
          .equalTo(user.uid);
        const tasksSnapshot = await tasksRef.get();
        const fetchedTasks = [];
        tasksSnapshot.forEach((taskSnapshot) => {
          fetchedTasks.push({
            id: taskSnapshot.key,
            ...taskSnapshot.val(),
          });
        });
        fetchedTasks.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });
        return fetchedTasks;
      } else {
        console.log('User is not signed in');
        setError('Please sign in to view your tasks.');
        return [];
      }
    } catch (fetchError) {
      console.error('Error fetching tasks:', fetchError);
      setError('An error occurred while fetching tasks.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    };

    fetchData();
  }, []);

  const deleteTask = async (id) => {
    try {
      await firebase.database().ref(`tasks/${id}`).remove();
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const TaskItem = ({ task }) => {
    const formattedDate = new Date(task.date);
    const formattedTime = new Date(task.time);
    const formattedDateTime = new Date(
      formattedDate.getFullYear(),
      formattedDate.getMonth(),
      formattedDate.getDate(),
      formattedTime.getHours(),
      formattedTime.getMinutes()
    );

    return (
      <View style={styles.taskItemContainer}>
        <View style={styles.tasksDetailsContainer}>
          <ScrollView style={styles.tasksContainer}>
            <Text style={styles.taskItemTitle}>{task.title}</Text>
            <Text style={styles.taskItemDescription}>
              {task.selectedSubject}
            </Text>
            <View style={styles.taskItemDateTime}>
              <Text style={styles.taskItemDateTime}>
                {formattedDateTime.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.taskItemDateTime}>
                {formattedDateTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => deleteTask(task.id)}
              style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>DONE</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  };
  if (loading) {
    return (
      <View>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <ScrollView style={styles.outContainer}>
        <ImageBackground
          source={require('../assets/bg.png')}
          style={[
            styles.outContainer,
            {
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
            },
          ]}
          resizeMode="cover">
          <Text style={styles.appTitleText}>THINGS PLANNER</Text>
          <ScrollView style={styles.container2}>
            <Text style={styles.appText}>NO UPCOMING TASKS FOUND</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('AddTask')}>
              <Text style={styles.buttonText}>ADD TASK</Text>
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.outContainer}>
      <ImageBackground
        source={require('../assets/bg.png')}
        style={[
          styles.outContainer,
          {
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
          },
        ]}
        resizeMode="cover">
        <Text style={styles.appTitleText}>THINGS PLANNER</Text>
        <ScrollView style={styles.container}>
          <CurrentDate />
          <Text style={styles.appText}>UPCOMING TASKS</Text>
          {tasks.map((task) => (
            <TaskItem task={task} key={task.id} />
          ))}
        </ScrollView>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outContainer: {
    flex: 1,
    //backgroundColor: '#feabc7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 60,
  },
  container: {
    flex: 1.5,
    backgroundColor: '#17181c',
    borderColor: '#796AD1',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    padding: 35,
    paddingTop: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  container2: {
    flex: 1.5,
    backgroundColor: '#17181c',
    borderColor: '#796AD1',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    padding: 45,
  },
  tasksContainer: {
    flex: 1,
  },
  appText: {
    justifyContent: 'center',
    color: '#796AD1',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 23,
    marginTop: 8,
  },
  button: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: '#feabc7',
    marginBottom: 20,
    width: 250,
    textAlign: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  taskItemContainer: {
    //backgroundColor: '#feabc7',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#feabc7',
    padding: 15,
    marginHorizontal: 10,
    marginTop: -10,
    marginBottom: 40,
    alignItems: 'center',
    alignSelf: 'center',
    width: 250,
    height: 200,
  },
  taskItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#feabc7',
  },
  taskItemDescription: {
    fontSize: 14,
    color: '#feabc7',
    marginTop: 5,
    fontWeight: 'bold',
  },
  tasksDetailsContainer: {
    flex: 1,
    width: '100%',
    fontWeight: 'bold',
  },
  taskItemDateTime: {
    fontSize: 12,
    color: '#feabc7',
    marginTop: 5,
    fontWeight: 'bold',
  },
  appTitleText: {
    justifyContent: 'center',
    color: '#796AD1',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 33,
    marginTop: 60,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#796AD1',
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default TaskList;
