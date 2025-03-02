// AddCustomerScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useOverlay } from '../components/OverlayProvider';

import CustomHeader from '../components/CustomHeader';
import Colors from '../constants/colors';
import firebaseApp from '../firebaseConfig';
import CheckMarkAnimation from '../components/CheckMarkAnimation';

function AddCustomerScreen() {
  const navigation = useNavigation();
  const db = getFirestore(firebaseApp);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { showCheckMark, hideCheckMark } = useOverlay();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    phoneNumber: '',
    email: '',
    // Birthdate stored as a Date object
    birthdate: new Date(),
    // Occupation will be selected via button group: 'Active' or 'Sedentary'
    occupation: '',
    fitnessLevel: '',
    healthProblems: '',
    injuries: '',
    medication: '',
    fitnessGoal: '',
    other: '',
    notified: false,
    lastPaymentDate: null,
    subscriptionEndDate: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFitnessLevelChange = (level) => {
    setFormData({ ...formData, fitnessLevel: level });
  };

  const handleFitnessGoalChange = (goal) => {
    setFormData({ ...formData, fitnessGoal: goal });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('birthdate', selectedDate);
    }
  };

  // Formats Date or Firestore Timestamp as YYYY-MM-DD
  const formatDate = (dateObj) => {
    if (!dateObj) return '-';
    if (dateObj.toDate) {
      return dateObj.toDate().toISOString().split('T')[0];
    } else if (dateObj instanceof Date) {
      return dateObj.toISOString().split('T')[0];
    }
    return '-';
  };

  const handleSave = async () => {
    try {
      const completePhoneNumber = "+357" + formData.phoneNumber;
      const customerData = {
        ...formData,
        phoneNumber: completePhoneNumber,
        createdAt: Timestamp.fromDate(new Date()),
        // Convert birthdate to a Firestore Timestamp
        birthdate: Timestamp.fromDate(formData.birthdate),
      };
      await addDoc(collection(db, 'customers'), customerData);
      // Show the check mark overlay
      showCheckMark();
      navigation.goBack();
      // Delay navigation to let the overlay play
      setTimeout(() => {
        hideCheckMark();
      }, 2000); // Adjust duration as needed
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Error saving customer');
    }
  };
  

  return (
    <>
      
      <View>
        <CustomHeader
          title="Create Customer"
          rightButtonTitle="Save"
          onPressLeft={() => navigation.goBack()}
          onPressRight={handleSave}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* First Name */}
        <View style={styles.fieldContainer}>
          <CheckMarkAnimation visible={showSuccess} />
          <Text style={styles.fieldLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor={Colors.white}
            value={formData.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
        </View>
        {/* Last Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor={Colors.white}
            value={formData.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
        </View>
        {/* Sex */}

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Sex</Text>
          <View style={styles.buttonGroup}>
            {["Male", "Female"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sexButton,
                  formData.sex === option && styles.buttonSelected,
                ]}
                onPress={() => handleChange("sex", option)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    formData.sex === option && styles.buttonTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      
        {/* Phone Number */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={styles.phoneContainer}>
            <Text style={styles.phonePrefix}>+357</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor={Colors.white}
              value={formData.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        {/* Email */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.white}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
          />
        </View>
        {/* Birthdate */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Birthdate</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: Colors.white }}>
              {formData.birthdate ? formatDate(formData.birthdate) : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.birthdate || new Date()}
              mode="date"
              display="spinner"
              onChange={onDateChange}
            />
          )}
        </View>
        {/* Occupation */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Occupation</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.sexButton,
                formData.occupation === 'Active' && styles.buttonSelected,
              ]}
              onPress={() => handleChange('occupation', 'Active')}
            >
              <Text
                style={[
                  styles.buttonText,
                  formData.occupation === 'Active' && styles.buttonTextSelected,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sexButton,
                formData.occupation === 'Sedentary' && styles.buttonSelected,
              ]}
              onPress={() => handleChange('occupation', 'Sedentary')}
            >
              <Text
                style={[
                  styles.buttonText,
                  formData.occupation === 'Sedentary' && styles.buttonTextSelected,
                ]}
              >
                Sedentary
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Fitness Level */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Fitness Level</Text>
          <View style={styles.buttonGroup}>
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.button,
                  formData.fitnessLevel === level && styles.buttonSelected,
                ]}
                onPress={() => handleFitnessLevelChange(level)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    formData.fitnessLevel === level && styles.buttonTextSelected,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Health Problems */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Health Problems</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Health Problems"
            placeholderTextColor={Colors.white}
            value={formData.healthProblems}
            onChangeText={(text) => handleChange('healthProblems', text)}
            multiline
          />
        </View>
        {/* Injuries */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Injuries</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Injuries"
            placeholderTextColor={Colors.white}
            value={formData.injuries}
            onChangeText={(text) => handleChange('injuries', text)}
            multiline
          />
        </View>
        {/* Medication */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Medication</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Medication"
            placeholderTextColor={Colors.white}
            value={formData.medication}
            onChangeText={(text) => handleChange('medication', text)}
            multiline
          />
        </View>
        {/* Fitness Goal */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Fitness Goal</Text>
          <View style={styles.buttonGroup}>
            {["Lose Weight", "Build Muscle", "Be Fit"].map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.button,
                  formData.fitnessGoal === goal && styles.buttonSelected,
                ]}
                onPress={() => handleFitnessGoalChange(goal)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    formData.fitnessGoal === goal && styles.buttonTextSelected,
                  ]}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Other */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Other</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Other"
            placeholderTextColor={Colors.white}
            value={formData.other}
            onChangeText={(text) => handleChange('other', text)}
            multiline
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.background,
    color: Colors.white,
    padding: 10,
    marginBottom: 10,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  fieldContainer: {
    width: '80%',
    marginBottom: 20,
  },
  fieldLabel: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  // Using sexButton style for flex buttons (for Sex and Occupation)
  sexButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  // For generic buttons like Fitness Level and Fitness Goal
  button: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonSelected: {
    backgroundColor: Colors.lightBlue,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonTextSelected: {
    color: Colors.background,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  phonePrefix: {
    color: Colors.white,
    marginRight: 10,
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    paddingVertical: 10,
  },
  sexContainer: {
    width: "80%",
    marginBottom: 20,
  },
});

export default AddCustomerScreen;
