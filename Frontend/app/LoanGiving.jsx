import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import {APIURl} from "../constants/Api";
import useAuthStore from '../store/UserAuth';
const GiveLoanScreen = () => {
  const superAdmin = useAuthStore((state) => state.user);
  const superAdminId=superAdmin._id;
  const route = useRoute();
  const { user } = route.params;
  
  const [witness1, setWitness1] = useState('');
  const [witness2, setWitness2] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [installments, setInstallments] = useState('');

  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

const handleGiveLoan = () => {
  if (!witness1 || !witness2 || !loanAmount || !installments) {
    Alert.alert('Error', 'Please fill in all fields.');
    return;
  }

  const loanDetails = {
    userId: user._id,
    name: user.name,
    witness1,
    witness2,
    amount: Number(loanAmount),
    installmentAmount: Number(installments),
    startMonth: month,
    startYear: Number(year),
    superAdminId,
  };

  const ApiCall = async () => {
    try {
      const response = await axios.post(`${APIURl}/addLoaner`, loanDetails);
      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Loan successfully uploaded.");
        setWitness1('');
        setWitness2('');
        setLoanAmount('');
        setInstallments('');
      } else {
        Alert.alert("Error", response.data?.message || "Something went wrong.");
      }
    } catch (err) {
      // console.error("Loan Upload Error =>", err?.response?.data || err.message);
      Alert.alert("Error", err?.response?.data?.message || "Network error.");
    }
  };
  ApiCall();
};



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}> {user.name} को लोन देवे</Text>

      <View style={styles.detailBox}>
        <Text style={styles.label}>नाम: <Text style={styles.value}>{user.name}</Text></Text>
        <Text style={styles.label}>पिता का नाम: <Text style={styles.value}>{user.fatherName}</Text></Text>
        <Text style={styles.label}>Mobile: <Text style={styles.value}>{user.mobile}</Text></Text>
        <Text style={styles.label}>पता: <Text style={styles.value}>{user.address}</Text></Text>
        <Text style={styles.label}>CIBIL Score: <Text style={styles.value}>{user.cibilScore}</Text></Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="गवाह 1"
        value={witness1}
        onChangeText={setWitness1}
      />
      <TextInput
        style={styles.input}
        placeholder="गवाह 2"
        value={witness2}
        onChangeText={setWitness2}
      />
      <TextInput
        style={styles.input}
        placeholder="लोन राशि"
        value={loanAmount}
        onChangeText={setLoanAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="किश्त कितने रुपए की होगी"
        value={installments}
        onChangeText={setInstallments}
        keyboardType="numeric"
      />

      <View style={styles.dateBox}>
        <Text>Date: {`${day} ${month}, ${year}`}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGiveLoan}>
        <Text style={styles.buttonText}>Give Loan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default GiveLoanScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateBox: {
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
