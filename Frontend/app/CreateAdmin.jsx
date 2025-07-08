import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { APIURl } from '../constants/Api';
import ToastManager, { Toast } from 'toastify-react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const CreateAdminScreen = () => {
  const route=useRoute();
  const{id : IBSSuperAdmin}=route.params;

  const navigation=useNavigation();
 
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    password: '',
    email: '',
    role: 'admin', // default to admin
    IBSSuperAdmin
    // You need to set this from logged-in SuperAdmin
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const handleBack=()=>{
    navigation.goBack();
  }

  const handleSubmit = async () => {
    
    if (!form.name || !form.mobile || !form.password || !form.IBSSuperAdmin) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    try {
      const res = await axios.post(`${APIURl}/registerAdmin`, form).then(function(res){
        if(res.status==201 || res.status==200){
          console.log("Success")
        }
        Toast.success("Admin Sucessfully Created");
      setForm({
        name: '',
        mobile: '',
        password: '',
        email: '',
        role: 'admin',
        address:'',
       IBSSuperAdmin: IBSSuperAdmin,
      });
      });
      
    } catch (err) {
      console.log(err);
     
      Toast.error(err.response?.data?.message || 'Something went wrong')
    }
  };

  return (
    <>
     <ToastManager/>
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Admin</Text>
        <Ionicons onPress={handleBack} style={{position:"absolute", top:30, left:5}} name='arrow-back' size={20} />
        <TextInput
          placeholder="Name"
          value={form.name}
          style={styles.input}
          onChangeText={text => handleChange('name', text)}
        />

        <TextInput
          placeholder="Mobile Number"
          value={form.mobile}
          style={styles.input}
          keyboardType="numeric"
          onChangeText={text => handleChange('mobile', text)}
        />

        <TextInput
          placeholder="Password"
          value={form.password}
          secureTextEntry
          style={styles.input}
          onChangeText={text => handleChange('password', text)}
        />

        <TextInput
          placeholder="Email (optional)"
          value={form.email}
          keyboardType="email-address"
          style={styles.input}
          onChangeText={text => handleChange('email', text)}
        />

        <TextInput
          placeholder="Address"
          value={form.address}
          style={styles.input}
          onChangeText={text => handleChange('address', text)}
        />

       

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Admin</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

export default CreateAdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 20,
    color: '#1F2937',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginVertical: 8,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
