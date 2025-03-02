// ViewCustomerScreen.js
import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  deleteDoc, 
  updateDoc, 
  Timestamp 
} from 'firebase/firestore';
import firebaseApp from '../firebaseConfig';
import Colors from '../constants/colors';
import CustomHeader2 from '../components/CustomHeader2';
import PaidButton from '../components/PaidButton';
import { useOverlay } from '../components/OverlayProvider';

function ViewCustomerScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { customer } = route.params; // Initial customer object passed from MainScreen
  const db = getFirestore(firebaseApp);

  // Local state for real-time updates
  const [customerData, setCustomerData] = useState(customer);

  const { showCheckMark, hideCheckMark } = useOverlay();

  useEffect(() => {
    const customerRef = doc(db, 'customers', customer.id);
    const unsubscribe = onSnapshot(customerRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setCustomerData({ ...docSnapshot.data(), id: docSnapshot.id });
      }
    }, (error) => {
      console.error("Error fetching real-time customer data:", error);
    });
    return () => unsubscribe();
  }, [customer.id]);

  // Helper to format a Firestore Timestamp (or ISO string) as YYYY-MM-DD
  const formatDate = (dateField) => {
    if (!dateField) return "-";
    const date = dateField.toDate ? dateField.toDate() : new Date(dateField);
    return date.toISOString().split('T')[0];
  };

  const handlePaid = async () => {
    try {
      const now = new Date();
      const lastPaymentTimestamp = Timestamp.fromDate(now);
      const subscriptionEndTimestamp = Timestamp.fromDate(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));

      const customerRef = doc(db, 'customers', customer.id);
      await updateDoc(customerRef, {
        lastPaymentDate: lastPaymentTimestamp,
        subscriptionEndDate: subscriptionEndTimestamp,
        notified: false,
      });

      showCheckMark();
      setTimeout(() => {
        hideCheckMark();
      }, 2000); // Adjust duration as needed
      // onSnapshot listener will update customerData automatically
    } catch (error) {
      console.error("Error updating customer:", error);
      Alert.alert("Error", "Failed to update customer payment details.");
    }
  };

  const handleEdit = () => {
    navigation.navigate("EditCustomer", { customer: customerData });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this customer? This action is permanent.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "customers", customer.id));
              showCheckMark();
              setTimeout(() => {
                hideCheckMark();
              }, 2000); // Adjust duration as needed
              navigation.navigate("Main");
            } catch (error) {
              console.error("Error deleting customer: ", error);
              Alert.alert("Error", "Error deleting customer");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  // Determine subscription status based on subscriptionEndDate
  const getSubscriptionStatus = () => {
    if (!customerData.subscriptionEndDate)
      return { active: false, message: "No data" };
    const now = new Date();
    const subEnd = customerData.subscriptionEndDate.toDate 
      ? customerData.subscriptionEndDate.toDate() 
      : new Date(customerData.subscriptionEndDate);
    return subEnd > now
      ? { active: true, message: "✔ Active" }
      : { active: false, message: "✖ Expired" };
  };

  const subscriptionStatus = getSubscriptionStatus();

  // Helper function to render a label and value pair
  const renderField = (label, value) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || "-"}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader2
        title="Customer Details"
        onPressLeft={() => navigation.goBack()}
        onPressEdit={handleEdit}
        onPressDelete={handleDelete}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <PaidButton onPress={handlePaid} />

          {/* Subscription Status */}
          <View style={styles.subscriptionStatusContainer}>
            <Text style={styles.statusLabel}>Last Payment:</Text>
            <Text style={styles.statusValue}>
              {formatDate(customerData.lastPaymentDate)}
            </Text>
            <Text style={styles.statusLabel}>Ends:</Text>
            <Text style={styles.statusValue}>
              {formatDate(customerData.subscriptionEndDate)}
            </Text>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text
              style={[
                styles.statusValue,
                subscriptionStatus.active ? styles.activeStatus : styles.expiredStatus,
              ]}
            >
              {subscriptionStatus.message}
            </Text>
          </View>

          {/* Customer Details */}
          {renderField("First Name", customerData.firstName)}
          {renderField("Last Name", customerData.lastName)}
          {renderField("Email", customerData.email)}
          {renderField("Birthdate", formatDate(customerData.birthdate))}
          {renderField("Occupation", customerData.occupation)}
          {renderField("Fitness Level", customerData.fitnessLevel)}
          {renderField("Sex", customerData.sex)}
          {renderField("Phone Number", customerData.phoneNumber)}
          {renderField("Health Problems", customerData.healthProblems)}
          {renderField("Injuries", customerData.injuries)}
          {renderField("Medication", customerData.medication)}
          {renderField("Fitness Goal", customerData.fitnessGoal)}
          {renderField("Other", customerData.other)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  subscriptionStatusContainer: {
    borderWidth: 1,
    borderColor: Colors.lightBlue,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: Colors.secondary,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 10,
  },
  activeStatus: {
    color: 'green',
  },
  expiredStatus: {
    color: 'red',
  },
  fieldContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
    paddingVertical: 5,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.white,
  },
});

export default ViewCustomerScreen;
