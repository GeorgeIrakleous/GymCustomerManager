// EditCustomerScreen.js
import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, doc, updateDoc, Timestamp } from 'firebase/firestore';
import CustomHeader from '../components/CustomHeader';
import Colors from '../constants/colors';
import firebaseApp from '../firebaseConfig';
import { useOverlay } from '../components/OverlayProvider';

function EditCustomerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { customer } = route.params; // Expect customer.id and data
  const db = getFirestore(firebaseApp);

  const { showCheckMark, hideCheckMark } = useOverlay();

  // Helper: convert Firestore Timestamp or string to a Date object.
  const toDateObj = (value) => {
    if (!value) return null;
    return value.toDate ? value.toDate() : new Date(value);
  };

  // Helper to format dates (Firestore Timestamp or Date object) as YYYY-MM-DD
  const formatDate = (dateObj) => {
    if (!dateObj) return '-';
    if (dateObj.toDate) {
      return dateObj.toDate().toISOString().split('T')[0];
    } else if (dateObj instanceof Date) {
      return dateObj.toISOString().split('T')[0];
    }
    return '-';
  };

  const [formData, setFormData] = useState({
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    sex: customer.sex || '',
    phoneNumber: customer.phoneNumber ? customer.phoneNumber.replace('+357', '') : '',
    email: customer.email || '',
    // Birthdate stored as a Date object
    birthdate: toDateObj(customer.birthdate) || new Date(),
    // Occupation as a button group (Active vs Sedentary)
    occupation: customer.occupation || '',
    fitnessLevel: customer.fitnessLevel || '',
    healthProblems: customer.healthProblems || '',
    injuries: customer.injuries || '',
    medication: customer.medication || '',
    fitnessGoal: customer.fitnessGoal || '',
    other: customer.other || '',
    lastPaymentDate: toDateObj(customer.lastPaymentDate),
    subscriptionEndDate: toDateObj(customer.subscriptionEndDate),
  });

  // Visibility state for each date picker
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);
  const [showLastPaymentPicker, setShowLastPaymentPicker] = useState(false);
  const [showSubscriptionPicker, setShowSubscriptionPicker] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFitnessLevelChange = (level) => {
    setFormData({ ...formData, fitnessLevel: level });
  };

  const handleFitnessGoalChange = (goal) => {
    setFormData({ ...formData, fitnessGoal: goal });
  };

  // Date picker change handlers
  const onBirthdateChange = (event, selectedDate) => {
    setShowBirthdatePicker(false);
    if (selectedDate) {
      handleChange('birthdate', selectedDate);
    }
  };

  const onLastPaymentChange = (event, selectedDate) => {
    setShowLastPaymentPicker(false);
    if (selectedDate) {
      handleChange('lastPaymentDate', selectedDate);
    }
  };

  const onSubscriptionChange = (event, selectedDate) => {
    setShowSubscriptionPicker(false);
    if (selectedDate) {
      handleChange('subscriptionEndDate', selectedDate);
    }
  };

  const handleSave = async () => {
    try {
      const completePhoneNumber = "+357" + formData.phoneNumber;
      const updatedData = {
        ...formData,
        phoneNumber: completePhoneNumber,
        // Convert Date objects to Firestore Timestamps
        birthdate: Timestamp.fromDate(formData.birthdate),
        lastPaymentDate: formData.lastPaymentDate ? Timestamp.fromDate(formData.lastPaymentDate) : null,
        subscriptionEndDate: formData.subscriptionEndDate ? Timestamp.fromDate(formData.subscriptionEndDate) : null,
      };
      const customerRef = doc(db, 'customers', customer.id);
      await updateDoc(customerRef, updatedData);
      showCheckMark();
      // Delay navigation to let the overlay play
      setTimeout(() => {
        hideCheckMark();
      }, 2000); // Adjust duration as needed
      navigation.goBack();
    } catch (e) {
      console.error('Error updating customer: ', e);
      Alert.alert("Error",'Error updating customer');
    }
  };

  return (
    <>
      <View>
        <CustomHeader
          title="Edit Customer"
          rightButtonTitle="Save"
          onPressLeft={() => navigation.goBack()}
          onPressRight={handleSave}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Payment Details Section */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Last Payment Date</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowLastPaymentPicker(true)}>
            <Text style={{ color: Colors.white }}>
              {formData.lastPaymentDate ? formatDate(formData.lastPaymentDate) : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showLastPaymentPicker && (
            <DateTimePicker
              value={formData.lastPaymentDate || new Date()}
              mode="date"
              display="spinner"
              onChange={onLastPaymentChange}
            />
          )}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Subscription End Date</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowSubscriptionPicker(true)}>
            <Text style={{ color: Colors.white }}>
              {formData.subscriptionEndDate ? formatDate(formData.subscriptionEndDate) : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showSubscriptionPicker && (
            <DateTimePicker
              value={formData.subscriptionEndDate || new Date()}
              mode="date"
              display="spinner"
              onChange={onSubscriptionChange}
            />
          )}
        </View>
        {/* Other Customer Fields */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
        </View>
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
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={styles.phoneContainer}>
            <Text style={styles.phonePrefix}>+357</Text>
            <TextInput
              style={styles.phoneInput}
              value={formData.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Birthdate</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowBirthdatePicker(true)}>
            <Text style={{ color: Colors.white }}>
              {formData.birthdate ? formatDate(formData.birthdate) : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showBirthdatePicker && (
            <DateTimePicker
              value={formData.birthdate || new Date()}
              mode="date"
              display="spinner"
              onChange={onBirthdateChange}
            />
          )}
        </View>
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
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Health Problems</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.healthProblems}
            onChangeText={(text) => handleChange('healthProblems', text)}
            placeholder="Health Problems"
            placeholderTextColor={Colors.white}
            multiline
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Injuries</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.injuries}
            onChangeText={(text) => handleChange('injuries', text)}
            placeholder="Injuries"
            placeholderTextColor={Colors.white}
            multiline
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Medication</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.medication}
            onChangeText={(text) => handleChange('medication', text)}
            placeholder="Medication"
            placeholderTextColor={Colors.white}
            multiline
          />
        </View>
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
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Other</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.other}
            onChangeText={(text) => handleChange('other', text)}
            placeholder="Other"
            placeholderTextColor={Colors.white}
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
  // Use sexButton style for flex buttons (for Sex and Occupation)
  sexButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  // For generic buttons (Fitness Level & Fitness Goal)
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

export default EditCustomerScreen;
