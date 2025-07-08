import { View, Text, Alert, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import useAuthStore from "../store/UserAuth"
import axios from "axios";
import {APIURl} from "../constants/Api";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 9 }, (_, i) => 2025 + i);

const singleAdminDetails = () => {
     const currentDate = new Date();
     const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
     const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const route = useRoute();
    const users = route.params;
    const user =users.user;
    const [allUsers , setAllUsers] =useState([]);
    const [isDisplay , setIsDisplay] = useState('monthlyPayment');
    const token = useAuthStore((state)=>state.token);
       const headers=useMemo(()=>({
       Authorization: `Bearer ${token}`
     }),[token]);
  const navigation = useNavigation();
    // Here we will call all the user and loan of the users 
    useEffect(()=>{
        const userCallBack =async()=>{
            try{
                const associateUsers = await axios.get(`${APIURl}/getUsersByAdmin/${user._id}`,{headers});
                if(associateUsers.status == 200){
                    Alert.alert("Data successfully stored");
                    // console.log("USERS ARE type of  ",associateUsers.data.users[0]);
                    let data = associateUsers.data.users;
                 
                    setAllUsers(data);
                 
                }
                else{
                    Alert.alert("Error ", "data not succesfully updated");
                }
            }
            catch(err){
                Alert.alert("Error", "Server Error");
            }

        }
        userCallBack();
    },[])
useEffect(() => {
  console.log("All USERS ARE" , allUsers);


  // const payedUsers = allUsers.filter(user=>
  //   Array.isArray(user.payments) && 
  //   user.payments.some(payment =>
  //     payment.status == "Paid" && payment.month ==  selectedMonth && payment.year == Number(selectedYear) 
  //   )
  // )
  // console.log("Payed Users are", payedUsers);
}, [allUsers ,selectedMonth , selectedYear])

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Ionicons style={{position:"absolute", left:10 , top: 10}} onPress={()=>{navigation .goBack()}} name='arrow-back' size={20}/>
        <Text style={styles.label}>Select Month:</Text>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={styles.picker}
        >
          {months.map((month, index) => (
            <Picker.Item key={index} label={month} value={month} />
          ))}
        </Picker>

        <Text style={styles.label}>Select Year:</Text>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={styles.picker}
        >
          {years.map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>

        <Text style={styles.output}>
          Selected: {selectedMonth} {selectedYear}
        </Text>
        <View style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
          <View style={{ width: "100%", display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-evenly", alignItems: "center" }}>
            <TouchableOpacity onPress={() => { setIsDisplay('monthlyPayment') }} style={styles.selectBtn}>
              <Text style={styles.selectBtnText}> Monthly Payments </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setIsDisplay('monthlyLoan') }} style={styles.selectBtn}>
              <Text style={styles.selectBtnText}> Loan </Text>
            </TouchableOpacity>
          </View>
          {isDisplay === 'monthlyPayment' ? (
            <FlatList
              data={allUsers.filter(user =>
                Array.isArray(user.payments) &&
                user.payments.some(payment =>
                  payment.status === "Paid" &&
                  payment.month === selectedMonth &&
                  payment.year === Number(selectedYear)
                )
              )}
              keyExtractor={item => item._id}
              style={{ flex: 1, marginTop: 10, padding: 2 }}
              renderItem={({ item }) => {
                const payment = item.payments.find(payment =>
                  payment.month === selectedMonth &&
                  payment.year === Number(selectedYear)
                );
                const isPaid = payment && payment.status === "Paid";
                return (
                  <View style={{ backgroundColor: 'white', marginVertical: 4, padding: 8, borderRadius: 8 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                    <Text>Phone: {item.mobile}</Text>
                    <Text>
                      Paid Amount: {payment?.amount || 'N/A'}
                    </Text>
                    <View style={{
                      alignSelf: 'flex-start',
                      backgroundColor: isPaid ? 'green' : 'red',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginTop: 6
                    }}>
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        {isPaid ? 'Paid' : 'Unpaid'}
                      </Text>
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={<Text>No paid users found for this month.</Text>}
            />
          ) : (
            <FlatList
              data={allUsers.filter(user =>
                Array.isArray(user.loans) &&
                user.loans.some(loan =>
                  loan.month === selectedMonth &&
                  loan.year === Number(selectedYear)
                )
              )}
              keyExtractor={item => item._id}
              style={{ flex: 1, marginTop: 10 }}
              renderItem={({ item }) => {
                const loan = item.loans.find(loan =>
                  loan.month === selectedMonth &&
                  loan.year === Number(selectedYear)
                );
                return (
                  <View style={{ backgroundColor: '#f0f0f0', marginVertical: 4, padding: 8, borderRadius: 8 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                    <Text>Phone: {item.phone}</Text>
                    <Text>
                      Loan Amount: {loan?.amount || 'N/A'}
                    </Text>
                  </View>
                );
              }}
              ListEmptyComponent={<Text>No loans found for this month.</Text>}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,

  },

  
  label: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  picker: {
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  output: {
    marginTop: 20,
    fontSize: 16,
    color:"blue"
  },
  selectBtn:{
    width:"30%",
    padding: 5,
    backgroundColor:"#ffe698",
    borderRadius: 12,
    borderColor:"black",
    borderWidth: 1,
    height: 50
  },
  selectBtnText:{
    color:"black",
    fontSize:15,
    fontWeight:700,
    textAlign:"center"
  }
});


export default singleAdminDetails