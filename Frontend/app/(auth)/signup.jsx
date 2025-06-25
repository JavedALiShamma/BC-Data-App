import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const navigation = useNavigation();

  const userTypes = ['Citizen', 'School', 'Shop', 'Hotel'];
  const handleLogin = () => {
    // Navigate to login screen
    // This is a placeholder, replace with actual navigation logic
    navigation.navigate('login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.card}>
        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#888"
        />

        {/* Mobile Number */}
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
          placeholderTextColor="#888"
        />

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Confirm Password"
            secureTextEntry={!confirmVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={() => setConfirmVisible(!confirmVisible)}
          >
            <Ionicons
              name={confirmVisible ? 'eye' : 'eye-off'}
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {/* Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Type:</Text>
          {userTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.dropdownOption,
                selectedType === type && styles.selectedOption,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  selectedType === type && styles.selectedText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
         <TouchableOpacity onPress={handleLogin} style={{marginTop:10, alignItems:"center"}}>
        <Text>Already have a account ? <Text style={{color:"red"}}> Login</Text> </Text>
      </TouchableOpacity>
      </View>
     
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#eaf6f6',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2e7d32',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    backgroundColor: '#f0f3f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f3f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  dropdownContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  dropdownLabel: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  dropdownOption: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f3f5',
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#a5d6a7',
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  registerButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
