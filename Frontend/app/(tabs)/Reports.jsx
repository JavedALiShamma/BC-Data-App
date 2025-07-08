import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { APIURl } from '../../constants/Api'

const Reports = () => {
  const [allUsers, setAllUsers]= useState();
  
  useEffect(()=>{
  const getAllData =async()=>{
    try{

      const getAllUsers = await axios.get(`${APIURl}/getAllUsers`)
      if(getAllUsers.status == 200){
        setAllUsers(getAllUsers.data.users);
        console.log( "Status code is 200",getAllUsers.data.users.length);
        // Alert.alert("Updated");
        

      }
    }
    catch(err){
      Alert.alert("Error in fetching");
    }
  }
  getAllData();
  },[])
  return (
    <SafeAreaView>
      {allUsers.map(user=>(<View><Text>{user.name}</Text></View>))}
    </SafeAreaView>
  )
}

export default Reports