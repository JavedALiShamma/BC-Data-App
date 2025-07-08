import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import useAuthStore from '../../store/UserAuth';
import { APIURl } from '../../constants/Api';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const now = new Date();
const currentMonth = months[now.getMonth()];
const currentYear = now.getFullYear();

const Loan = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const allUsers = useAuthStore((state) => state.allUsers);

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [loaners, setLoaners] = useState([]);
  const [filteredLoaners, setFilteredLoaners] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLoaners = useCallback(async () => {
    const userWithLoan = allUsers.filter(
      (u) => u.hasLoan === true && u.activeLoanId != null
    );
    const userIds = userWithLoan.map((user) => user._id);

    if (userIds.length === 0) return;

    try {
      const response = await axios.post(`${APIURl}/getLoanerForAdmin`, {
        userIds: userIds,
      });

      if (response.status === 200 || response.status === 201) {
        setLoaners(response.data.activeLoaners || []);
      }
    } catch (err) {
      Alert.alert('Error', `${err}`);
    }
  }, [allUsers]);

  useEffect(() => {
    fetchLoaners();
  }, [fetchLoaners]);

  useEffect(() => {
    console.log("LOANERS are" , loaners);
    const result = loaners.filter((loan) => {
      const paid = loan.installmentsPaid || [];
      const hasPaid = paid.some(
        (inst) => inst.month === month && parseInt(inst.year) === parseInt(year)
      );
      return !hasPaid;
    });

    setFilteredLoaners(result);
  }, [month, year, loaners]);

  const handlePay = (loaner) => {
    const form = {
      id: loaner.userId,
      month,
      year,
      amount: Number(loaner.installmentAmount),
      status: "Paid",
      superAdmin: user.IBSSuperAdmin,
    };

    const ApiCall = async () => {
      try {
        const response = await axios.post(`${APIURl}/addLoanInstallment`, form);
        if (response.status === 200 || response.status === 201) {
          Alert.alert("Successful", `${response.data.message}`);
          fetchLoaners(); // Refresh list after payment
        } else {
          Alert.alert("Unsuccessful", "Data is not filled");
        }
      } catch (err) {
        console.log("API Call Error:", err);
        Alert.alert("Error", "Something went wrong");
      }
    };

    ApiCall();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLoaners();
    setRefreshing(false);
  };

  const renderLoaner = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>👤 {item.name}</Text>
        <View style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}> कुल लोन ₹{item.amount}</Text>
          </View>
          <View style={{ backgroundColor: "red", borderRadius: 5, padding: 5 }}>
            <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>बाकया राशि ₹{item.outstandingBalance}</Text>
          </View>
        </View>
      </View>
      <Text>👥 गवाह 1: {item.witness1 || 'N/A'}</Text>
      <Text>👥 गवाह 2: {item.witness2 || 'N/A'}</Text>
      <TouchableOpacity style={styles.payButton} onPress={() => handlePay(item)}>
        <Text style={styles.payButtonText}>
          Pay ₹{item.installmentAmount || 'N/A'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>लोन किश्त बाकी है</Text>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={month}
          style={styles.picker}
          onValueChange={(itemValue) => setMonth(itemValue)}
        >
          {months.map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>

        <Picker
          selectedValue={year}
          style={styles.picker}
          onValueChange={(itemValue) => setYear(itemValue)}
        >
          {[2024, 2025, 2026].map((y) => (
            <Picker.Item key={y} label={`${y}`} value={y} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredLoaners}
        keyExtractor={(item) => item._id}
        renderItem={renderLoaner}
        ListEmptyComponent={<Text style={styles.noData}>No pending installments</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default Loan;


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2', marginBottom:50 },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  picker: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  badge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  payButton: {
    marginTop: 12,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noData: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
});
