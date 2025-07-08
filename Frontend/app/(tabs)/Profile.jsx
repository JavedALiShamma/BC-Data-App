import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, RefreshControl
} from 'react-native';
import useAuthStore from '../../store/UserAuth';
import axios from 'axios';
import { APIURl } from '../../constants/Api';
import { useNavigation } from 'expo-router';
import ToastManager, { Toast } from 'toastify-react-native'

const SuperAdminProfileScreen = () => {
  const { user, setStore, logout } = useAuthStore();
  const [startsFrom, setStartsFrom] = useState('');
  const [monthlyFees, setMonthlyFees] = useState('');
  const [storeDetails, setStoreDetails] = useState(null);
  const [collectedInstallments, setCollectedInstallments] = useState('');
  const [standingBalance, setStandingBalance] = useState('');
  const [prevMonthBalance, setPrevMonthBalance] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigation.replace('(auth)');
  };

  const checkStore = async () => {
    if (!user?._id) return;
    try {
      const storeRespose = await axios.post(`${APIURl}/getStoreBalance`, { userId: user._id });
      if (storeRespose.status === 200) {
        setStoreDetails(storeRespose.data.store);
        setStore(storeRespose.data.store.monthlyFees, storeRespose.data.store.startsFrom);
      } else {
        Alert.alert("Unsuccessful", "No store is present");
      }
    } catch (err) {
      Alert.alert("Error while loading", "Error");
    }
  };

  useEffect(() => {
    checkStore();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkStore().finally(() => setRefreshing(false));
  }, []);

  if (!user) return null;

  const handleCreateStore = async () => {
    if (!startsFrom || !monthlyFees) {
      Alert.alert('Error', 'Please enter Starts From and Monthly Fees');
      return;
    }

    const storePayload = {
      userId: user._id,
      startsFrom,
      monthlyFees: Number(monthlyFees),
      totalInstallmentsCollected: Number(collectedInstallments),
      standingBalance: Number(standingBalance),
      balanceFromPreviousMonths: Number(prevMonthBalance),
      monthlyPayment: [],
      monthlyInstallment: [],
      monthlyLoanGiven: []
    };

    try {
      const res = await axios.post(`${APIURl}/createStore`, storePayload);
      setStoreDetails(res.data);
      Alert.alert('Success', 'Store created successfully!');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong while creating the store.');
    }
  };

  return (
    <>
     <ToastManager/>
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Super Admin Profile</Text>
      <View style={styles.profileBox}>
        <Text style={styles.label}>Name: <Text style={styles.value}>{user?.name}</Text></Text>
        <Text style={styles.label}>Email: <Text style={styles.value}>{user?.email}</Text></Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {!storeDetails && (
        <>
          <Text style={styles.subtitle}>Create Store</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Starts From (e.g. 2025-06)"
              value={startsFrom}
              onChangeText={setStartsFrom}
            />
            <TextInput
              style={styles.input}
              placeholder="Monthly Fees"
              keyboardType="numeric"
              value={monthlyFees}
              onChangeText={setMonthlyFees}
            />
            <TextInput
              style={styles.input}
              placeholder="Total Installments Collected"
              keyboardType="numeric"
              value={collectedInstallments}
              onChangeText={setCollectedInstallments}
            />
            <TextInput
              style={styles.input}
              placeholder="Standing Balance"
              keyboardType="numeric"
              value={standingBalance}
              onChangeText={setStandingBalance}
            />
            <TextInput
              style={styles.input}
              placeholder="Previous Month Balance"
              keyboardType="numeric"
              value={prevMonthBalance}
              onChangeText={setPrevMonthBalance}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateStore}>
              <Text style={styles.buttonText}>Create Store</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {storeDetails && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Store Created</Text>
          <Text>User ID: {storeDetails.userId}</Text>
          <Text>Starts From: {storeDetails.startsFrom}</Text>
          <Text>Monthly Fees: ₹{storeDetails.monthlyFees}</Text>
          <Text>Collected: ₹{storeDetails.totalInstallmentsCollected}</Text>
          <Text>Standing Balance: ₹{storeDetails.standingBalance}</Text>
          <Text>Prev Month Balance: ₹{storeDetails.balanceFromPreviousMonths}</Text>
        </View>
      )}
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  profileBox: { marginBottom: 20, padding: 10, borderWidth: 1, borderRadius: 10 },
  label: { fontWeight: 'bold' },
  value: { fontWeight: 'normal' },
  logoutBtn: { marginTop: 10, backgroundColor: '#c0392b', padding: 10, borderRadius: 5 },
  logoutText: { color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  form: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#2980b9', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  card: { marginTop: 20, padding: 15, borderWidth: 1, borderRadius: 10, backgroundColor: '#ecf0f1' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: "center", color: "blue" }
});

export default SuperAdminProfileScreen;
