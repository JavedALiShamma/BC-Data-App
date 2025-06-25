import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AllUsersList = () => {
    
    const route=useRoute();
  const { users } = route.params;
    const navigation =useNavigation();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(months[currentDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [paidUsersCount, setPaidUsersCount] = useState(0);
  const [unpaidUsersCount, setUnpaidUsersCount] = useState(0);
    const handleBack=()=>{
        navigation.goBack()
    }
  useEffect(() => {
    let paid = 0;
    let unpaid = 0;

    const filtered = users.filter(user => {
      if (!user.payments || !Array.isArray(user.payments)) return false;

      const payment = user.payments.find(
        (p) => p.month === selectedMonth && p.year === parseInt(selectedYear)
      );

      if (payment?.amount > 0) {
        paid++;
        return true;
      } else {
        unpaid++;
        return true;
      }
    });

    setFilteredUsers(filtered);
    setPaidUsersCount(paid);
    setUnpaidUsersCount(unpaid);
  }, [selectedMonth, selectedYear, users]);

  const renderHeader = () => (
    <>
      <Text style={styles.heading}>All Users List</Text>
    <Ionicons onPress={handleBack} style={{position:"absolute", top:10}} name='arrow-back' size={20}/>
      {/* Pickers */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {[2023, 2024, 2025, 2026].map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          {months.map((month) => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>कुल: {filteredUsers.length}</Text>
        <Text style={[styles.summaryText, { color: 'green' }]}>पूर्ण: {paidUsersCount}</Text>
        <Text style={[styles.summaryText, { color: 'red' }]}>बाकी: {unpaidUsersCount}</Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const payment = item.payments.find(
            (p) => p.month === selectedMonth && p.year === parseInt(selectedYear)
          );
          const hasPaid = payment?.amount > 0;

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: hasPaid ? 'green' : 'red' }]}>
                  <Text style={styles.badgeText}>{hasPaid ? 'Paid' : 'Unpaid'}</Text>
                </View>
              </View>
              <Text style={styles.subText}>Father: {item.fatherName}</Text>
              <Text style={styles.subText}>Mobile: {item.mobile}</Text>

              <Text style={styles.subText}>Paid: ₹{payment?.amount || 0}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  pickerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  picker: { flex: 1, height: 50 },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  summaryText: { fontSize: 16, fontWeight: '600' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 15, color: '#555', marginVertical: 2 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 12 },
});

export default AllUsersList;
