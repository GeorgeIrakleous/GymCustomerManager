// screens/MainScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import CustomerItem from '../components/CustomerItem';
import CircleButton from '../components/CircleButton';
import Colors from '../constants/colors';
import firebaseApp from '../firebaseConfig';

// Helper function to check if 'sub' is a subsequence of 'str'
const isSubsequence = (sub, str) => {
  let i = 0;
  let j = 0;
  while (i < sub.length && j < str.length) {
    if (sub[i] === str[j]) {
      i++;
    }
    j++;
  }
  return i === sub.length;
};

function MainScreen() {
  const navigation = useNavigation();
  const db = getFirestore(firebaseApp);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const q = query(collection(db, "customers"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort the customers on the client side in a case-insensitive manner
      customersData.sort((a, b) => a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase()));
      setCustomers(customersData);
      setLoading(false);
    }, error => {
      console.error("Error fetching customers: ", error);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, [db]);
  

  // Filter customers based on the search query as a subsequence
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const queryLower = searchQuery.toLowerCase();
    return isSubsequence(queryLower, fullName);
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.lightBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <MaterialIcons name="search" size={24} color={Colors.white} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Customers"
          placeholderTextColor={Colors.white}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ViewCustomer', { customer: item })}>
            <CustomerItem customer={item} />
          </TouchableOpacity>
        )}
      />
      <CircleButton onPress={() => navigation.navigate('AddCustomer')} />
        
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.searchBar, // Ensure you add this color in your Colors file
    width: '90%',
    borderRadius: 8,
    padding: 10,  // Increased padding for a larger look
    alignSelf: 'center',
    marginVertical: 15,
  },
  searchIcon: {
    marginRight: 10,
    marginLeft: 8,
  },
  searchBar: {
    flex: 1,
    fontSize: 18, // Larger text
    color: Colors.white,
  },
  // ... other styles remain unchanged
});


export default MainScreen;
