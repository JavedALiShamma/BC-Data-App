import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import useAuthStore from '../store/UserAuth';
import { APIURl } from '../constants/Api';
import ToastManager, { Toast } from 'toastify-react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';




const AddUserScreen = () => {
    const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
 
  const superAdmin= user._id;
    const navigation=useNavigation();
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    address: '',
    mobile: '',
    role:"user",
    superAdmin:superAdmin,
    password:''

  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };
  const handleback=()=>{
    navigation.goBack();
  }

  const handleSubmit = async () => {
  const { name, fatherName, address, mobile } = form;

  if (!name || !fatherName || !address || !mobile) {
    Alert.alert('Missing Fields', 'Please fill all fields.');
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    Alert.alert('Invalid Mobile', 'Mobile number must be 10 digits.');
    return;
  }

  try {
    const response = await axios.post(`${APIURl}/registerUser`, {
      name,
      fatherName,
      address,
      mobile,
      superAdmin:superAdmin,
      role:"user",
    
    },{
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
);

    if (response.data.success) {
      
        Toast.success(`${response.data.user.name} "Successfull added`);
      setForm({ name: '', fatherName: '', address: '', mobile: '' });
    } else {
        Toast.error(`${response.data.message || "Something went wrong"}`);
     
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Server Error', error.response?.data?.message || 'Could not connect to server.');
  }
};

  return (
    <>
   <ToastManager/>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.title}>Add New User</Text>
            <Ionicons onPress={handleback} style={{position:'absolute', top:27, left:10}} name="arrow-back" size={22}/>
          <TextInput
            style={styles.input}
            placeholder="नाम"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="पिता का नाम"
            value={form.fatherName}
            onChangeText={(text) => handleChange('fatherName', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="पता"
            value={form.address}
            onChangeText={(text) => handleChange('address', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="मोबाइल नंबर"
            keyboardType="number-pad"
            maxLength={10}
            value={form.mobile}
            onChangeText={(text) => handleChange('mobile', text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
  );
};

export default AddUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  inner: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
