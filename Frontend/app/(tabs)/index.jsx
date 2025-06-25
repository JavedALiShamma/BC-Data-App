import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../store/UserAuth';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import { APIURl } from '../../constants/Api';
import { useFocusEffect } from '@react-navigation/native';

const SuperAdminHomeScreen = () => {
  const [totalAdmins, setTotalAdmins] = useState([]);
  const [totalUsers,setTotalUsers]=useState([]);
  const [currentMonthColl,setCurrentMonthColl]=useState(0);
  const navigation = useNavigation();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const superAdminName = `Welcome, ${user.name}`;
  //// Here will try to fetch the data 
  const totalCollection =()=>{
    let TOTALAMONT=0;
      totalUsers.forEach(user => {
        const payment = user.payments.find(
          p => p.month === currentMonth && p.year === currentYear && p.status === 'Paid'
        );
        if (payment) {
        
          TOTALAMONT += payment.amount; // Ensure amount is present
        }
      });
      setCurrentMonthColl(TOTALAMONT);
  }
  const headers=useMemo(()=>({
    Authorization: `Bearer ${token}`
  }),[]);
   const fetchData =useMemo(()=>{
    return async ()=>{
      try{
        // Here we need to set Loading true
        const [res1, res2]= await Promise.all([
          axios.get(`${APIURl}/getAllAdmins`,{headers}),
          axios.get(`${APIURl}/getAllUsers`)
        ]);
        // Here we will set Data
        const count = res1.data.users;
        setTotalAdmins(count);
        const totalUser=res2.data.users
        setTotalUsers(totalUser);
       
      }
      catch(err){
        console.log(err);
      }
      finally{
        // Here we will set loading isequal to false
      }
    }
   },[])

  useFocusEffect(
  React.useCallback(() => {
 
    fetchData();
    totalCollection();
    
  }, [fetchData,totalCollection])
);

  const handleNavigation = (item) => {
    if (item === "मुखिया बनाये") {
      navigation.navigate("CreateAdmin", { id: user._id });
    }
    if(item == "सभी यूजर देखें"){
      navigation.navigate("AllUserList" ,{users:totalUsers});
    }
  };



  const summaryData = [
    { title: 'Total Users', value: totalUsers.length },
    { title: 'Total Admins', value: totalAdmins.length },
    { title: 'मासिक भुगतान', value: '₹200' },
    { title: 'कुल भुगतान राशि', value: currentMonthColl },
  ];

  const actionList = [
    "मुखिया बनाये",
    "सभी यूजर देखें",
    "View Transactions",
    "Select Beneficiary"
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>{superAdminName}</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.cardContainer}>
          {summaryData.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Beneficiary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month’s Beneficiary</Text>
          <View style={styles.beneficiaryCard}>
            <Text style={styles.beneficiaryName}>Mohd Aamir</Text>
            <Text style={styles.beneficiaryStatus}>Status: Not Paid</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {actionList.map((item, index) => (
            <TouchableOpacity onPress={() => handleNavigation(item)} key={index} style={styles.actionButton}>
              <Text style={styles.actionText}>{item}</Text>
              <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Report Download */}
        <TouchableOpacity style={styles.reportButton}>
          <Ionicons name="document-text-outline" size={22} color="#fff" />
          <Text style={styles.reportText}>मासिक रिपोर्ट देखें</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuperAdminHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    marginBottom: 50,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
  },
  iconButton: {
    backgroundColor: '#E0E7FF',
    padding: 8,
    borderRadius: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderColor: "#3B82F6",
    borderWidth: 1.5,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 6,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  beneficiaryCard: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
  },
  beneficiaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  beneficiaryStatus: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  reportButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    marginVertical: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
