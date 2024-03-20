import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DropDownPicker from 'react-native-dropdown-picker';

import firebase from 'firebase';

import { firebaseConfig } from '../config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const AddTask = (props: { navigation: NavigationProp<any, any> }) => {
  const Stack = createStackNavigator();
  const navigation = props.navigation;
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [items, setItems] = useState([
    { label: 'MATH', value: 'MATH' },
    { label: 'ENGLISH', value: 'ENGLISH' },
    { label: 'HINDI', value: 'HINDI' },
    { label: 'PHYSICS', value: 'PHYSICS' },
    { label: 'CHEMISTRY', value: 'CHEMISTRY' },
    { label: 'BIOLOGY', value: 'BIOLOGY' },
    { label: 'COMPUTERS', value: 'COMPUTERS' },
    { label: 'ECONOMICS', value: 'ECONOMICS' },
    { label: 'HISTORY', value: 'HISTORY' },
    { label: 'GEOGRAPHY', value: 'GEOGRAPHY' },
  ]);

  const addDatabase = useCallback(async () => {
    if (
      !title ||
      !selectedSubject ||
      !selectedDate ||
      !selectedTime.toISOString()
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    console.log('Add to database');
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const task = {
          userId: user.uid,
          title: title,
          selectedSubject: selectedSubject,
          date: selectedDate.toISOString(),
          time: selectedTime.toISOString(),
        };

        const response = await firebase.database().ref('tasks').push(task);
        console.log('Task added with ID:', response.key);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        );
      } else {
        console.log('User is not signed in');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [title, selectedSubject, selectedDate, selectedTime]);

  const handleSubmit = () => {
    addDatabase();
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = new Date(date);
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (time) => {
    const formattedTime = new Date(time);
    setSelectedTime(formattedTime);
    hideTimePicker();
  };

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
        <Text style={styles.appTitleText}>ADD TASK</Text>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder={'ENTER TITLE'}
            placeholderTextColor={'#feabc7'}
            color={'#feabc7'}
          />
          <DropDownPicker
            open={open}
            value={selectedSubject}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedSubject}
            setItems={setItems}
            style={styles.dropContainer}
            dropDownContainerStyle={styles.dropDownContainer}
            itemStyle={styles.itemStyle}
            labelStyle={styles.labelStyle}
            textStyle={styles.dropText}
            arrowIconStyle={styles.icon}
            tickIconStyle={styles.icon}
            placeholder="SELECT SUBJECT"
          />
          <View style={styles.dateTimeContainer}>
            <Button
              title="Select a date"
              onPress={showDatePicker}
              color="#796AD1"
            />
            <DateTimePickerModal
              date={selectedDate}
              isVisible={datePickerVisible}
              mode="date"
              display="inline"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />

            <Text style={styles.appText}>
              DATE:{' '}
              {selectedDate
                ? selectedDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : 'Select a Date'}
            </Text>
          </View>

          <View style={styles.dateTimeContainer}>
            <Button
              title="Select a time"
              onPress={showTimePicker}
              color="#796AD1"
            />
            <DateTimePickerModal
              time={selectedTime}
              isVisible={timePickerVisible}
              mode="time"
              display="inline"
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
            />
            <Text style={styles.appText}>
              TIME:{' '}
              {selectedTime
                ? selectedTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : 'Select a Time'}
            </Text>
          </View>

          <Button
            title="      Submit      "
            onPress={handleSubmit}
            color="#feabc7"
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

AddTask.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

AddTask.defaultProps = {
  navigation: {},
};

export default AddTask;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: '#feabc7',
    borderRadius: 10,
  },
  dropText: {
    color: '#feabc7',
    fontWeight: 'bold',
  },
  dropContainer: {
    backgroundColor: '#17181c',
    width: 250,
    borderColor: '#796AD1',
    borderWidth: 3,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15
  },
  dropDownContainer: {
    backgroundColor: '#17181c',
    borderColor: '#796AD1',
    borderWidth: 3,
    borderRadius: 10,
    width: 250,
    alignSelf: 'center',
    textColor: '#feabc7',
  },
  itemStyle: {
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  labelStyle: {
    color: '#feabc7',
    fontWeight: 'bold',
  },
  dateTimeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#feabc7',
    width: 250,
    height: 120,
  },
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    borderColor: '#796AD1',
    borderWidth: 3,
    padding: 30,
  },
  input: {
    borderWidth: 3,
    borderColor: '#796AD1',
    placeholderTextColor: '#feabc7',
    fontWeight: 'bold',
    borderRadius: 10,
    paddingVertical: 7,
    width: 250,
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  appText: {
    justifyContent: 'center',
    color: '#796AD1',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
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
});
