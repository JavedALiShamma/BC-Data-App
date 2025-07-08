import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import useAuthStore from '../store/UserAuth';
import { useRoute } from '@react-navigation/native';
import { APIURl } from '../constants/Api';
import { Ionicons } from '@expo/vector-icons';
import ToastManager, { Toast } from 'toastify-react-native'
import { useNavigation } from 'expo-router';
// const APIURl = 'http://<your-ip>:3000'; // replace with your backend URL

const UserDetailsScreen = () => {
  const route=useRoute();
   const { user: passedUser } = route.params;
  // const { user: passedUser } = route.params;

  const token = useAuthStore((state) => state.token);
  const admin= useAuthStore((state)=>state.user);
  
  //
  const navigation =useNavigation();
  const IBSSuperAdmin=admin.IBSSuperAdmin;
  const [user, setUser] = useState(passedUser);
  const [isAppliedLoan, setIsAppliedLoan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
 
    if (!user) return <Text>Loading user data...</Text>;
  const payment = user.payments.find(p => p.month === currentMonth && p.year === currentYear);
  const paymentStatus = payment?.status || 'Unpaid';
  const handleBack =()=>{
    console.log("backi is presed");
    navigation.goBack();
  }
  const updateCurrentMonthStatus =  () => {
    const ApiCall =async()=>{
    setIsLoading(true);
      try {
      const res = await axios.put(
        `${APIURl}/updateMonthlyFees/${passedUser._id}`,
        {
          month: currentMonth,
          year: currentYear,
          status: 'Paid',
          // AMOUNT IS REMOVED FROM HERE
          isAppliedLoan:isAppliedLoan,
          superAdmin:IBSSuperAdmin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(function(res){
        if(res.status==201){
          console.log("Successfully Updated");
          Toast.success(res.data.message);
        }
        else{
          Alert.alert("Failed", `${res.status}`);
          return;
          
        }
      }).catch(function(err){
        console.log("error Occured", err);
        Toast.error(`${err}`);
        return; 
      }).finally(()=>{
        setIsLoading(false);
      });

      
      // Update local state after successful update
      if (payment) {
        const updatedPayments = user.payments.map(p =>
          p.month === currentMonth && p.year === currentYear
            ? { ...p, status: 'Paid', paidOn: new Date() }
            : p
        );
        setUser({ ...user, payments: updatedPayments });
      } else {
        setUser({
          ...user,
          payments: [...user.payments, {
            month: currentMonth,
            year: currentYear,
            status: 'Paid',
            paidOn: new Date(),
          }]
        });
      }
    } catch (err) {
      console.error(err);
      Toast.error(`${err}`);
    }
    }
    ApiCall();
    
  };

  return (
    <>
    <ToastManager/>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>User Details</Text>
      <Ionicons style={{position:"absolute" , top:25 , left:20}} onPress={handleBack} name='arrow-back' size={25}/>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Father Name:</Text>
        <Text style={styles.value}>{user.fatherName}</Text>

        <Text style={styles.label}>Mobile:</Text>
        <Text style={styles.value}>{user.mobile}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{user.address}</Text>

        <Text style={styles.label}>Loan:</Text>
        <Text style={styles.value}>{user.hasLoan ? `Yes - ₹${user.loanAmount}` : 'No'}</Text>
      </View>

      <View style={styles.paymentCard}>
        <Text style={styles.paymentTitle}>Payment for {currentMonth} {currentYear}</Text>
        <View style={[styles.badge, paymentStatus === 'Paid' ? styles.paid : styles.unpaid]}>
          <Text style={styles.badgeText}>{paymentStatus}</Text>
        </View>
          {paymentStatus !=='Paid' && !isAppliedLoan ? (
        <TouchableOpacity style={styles.applyButton} onPress={() => setIsAppliedLoan(true)}>
          <Text style={styles.applyText}>लोन के लिए आवेदन करें</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.actionContainer}>
          <Ionicons name="checkmark-circle" size={32} color="green" />
          <TouchableOpacity onPress={() => setIsAppliedLoan(false)} style={styles.cancelButton}>
            <Ionicons name="close-circle" size={32} color="red" />
          </TouchableOpacity>
        </View>
      )}
        {paymentStatus !== 'Paid' && (
          <>
          <TouchableOpacity style={styles.button} onPress={updateCurrentMonthStatus}>
            {isLoading? <ActivityIndicator color="#fff" /> :<Text style={styles.buttonText}>भुगतान प्राप्त हुआ</Text>}
            

          </TouchableOpacity>
         
            </>
        )}
      
      </View>
    </ScrollView>
    </>
  );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign:"center"
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
  },
  paymentCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  paid: {
    backgroundColor: 'green',
  },
  unpaid: {
    backgroundColor: 'red',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
   applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop:5,
   
  },
  applyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:"center"
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  cancelButton: {
    marginLeft: 10,
  },
});
