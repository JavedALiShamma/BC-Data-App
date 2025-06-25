import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,ImageBackground } from 'react-native'
import React, { useState } from 'react'
import {Link, useNavigation} from "expo-router"
import styles from "../../assets/styles/login.styles";
import {Image} from "react-native"
import COLORS from '../../constants/colors';
import {Ionicons} from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import axios from 'axios';
import useAuthStore from '../../store/UserAuth';
import ToastManager, { Toast } from 'toastify-react-native'
import { APIURl } from '../../constants/Api';
function Login() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [isError,setError]=useState(null);
  
  const router = useRouter();
  const navigation =useNavigation();
  const handleLogin=async ()=>{
    // I want to send it to the (tabs) page
 
     // Here we need to change the link 
          setIsLoading(true);
          if(!email || !password){
            setError('Please Fill email and password');
            setIsLoading(false);
            return;
          }

    //192.168.100.4
      await axios.post(`${APIURl}/loginSuperAdmin`,{
        mobile:email,
        password:password
      }).then(function(res){
        if(res.status==200){
          
          const{user, token}=res.data;
          console.log(res.data);
          useAuthStore.getState().login(user,token);
           Toast.success('Login sucessfull');
           if(user.role === 'superadmin'){
            navigation.navigate("(tabs)")
           }
           else{
             navigation.navigate("(adminTabs)");
           }
        }
        else{
          console.log("resposnse data",res.data);
          setError("Invalid email and password");
        }
      }).catch(function(err){
        Toast.error("Invalid Email or password");
        console.log("error is",err)
      }).finally(()=>{
        setIsLoading(false)
      })
      
      setIsLoading(false)
    // Now here we need to update this user name and password to the backend server

  }
  return (
    <>
    <ToastManager/>
    <KeyboardAvoidingView
    style={{flex:1}}
    behavior={Platform.OS ==="ios" ? "padding":"height"}
    >
   
    <View style={styles.container}>
    <View style={{width:"100%", height:"45%" ,backgroundColor:"white"}}>
      <ImageBackground
      source={require("../../assets/images/CCBackground.png")}
      resizeMode="contain"
      style={{width:"100%", height:"100%", position:"absolute"}}

      
      >
          <Image
        source={require("../../assets/images/cleanCityNoBG.png")}
        resizeMode='contain'
        style={styles.illustrationImage}
        
        />
    
      </ImageBackground>
      
    </View>
    {isError && <Text style={{color:"red", textAlign:"center", marginTop :2 ,marginBottom:5}}>{isError}</Text>}
    {/* <View style={styles.topIllustration}>
      
      </View> */}
      {/* Here we will add illustration */}
      <View style={styles.topIllustration}
      >
      </View>
      <View style={{padding:20 ,backgroundColor:"white"}}>
      <View style={styles.card}>
      {/* <Text style={styles.title}> Login As User</Text> */}
      <View style={styles.formContainer}>
      {/* Here we will add email and password section */}
      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.inputContainer}>
        <Ionicons
        name="phone-portrait-outline"
        size={20}
        color={COLORS.primary}
        style={styles.inputIcon}

        />
        <TextInput
        style={styles.input}
        placeholder='Enter your mobile Number'
        value={email}
        onChangeText={setEmail}
         keyboardType="number-pad"
        // keyboardType='email-address'
        autoCapitalize='none'        
        />
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          {/* LEFT ICON */}
          <Ionicons
          name='lock-closed-outline'
          size={20}
          color={COLORS.primary}
          style={styles.inputIcon}
          />
          {/* TEXT INPUT */}
          <TextInput
          style={styles.input}
          placeholder='Enter the password'
          placeholderTextColor={COLORS.placeholderText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          />
          {/* RIGHT ICON */}
          <TouchableOpacity
          onPress={()=>setShowPassword(!showPassword)}
          style={styles.eyeIcon}
          >
            <Ionicons
            name={showPassword ? "eye-outline":"eye-off-outline"}
            size={20}
            color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}
      disabled={isLoading}
      >
        {isLoading ?(
          <ActivityIndicator color="#fff"/>
        ):(
          <Text style={styles.buttonText}>Login</Text>
        )}

      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account</Text>
        <Link href="/signup" asChild>
        <TouchableOpacity>
          <Text
          style={styles.link}>
            Sign Up
          </Text>
        </TouchableOpacity>
        </Link>

      </View>
      </View>
      </View>

      </View>
    </View>
    </KeyboardAvoidingView>
    </>
  )
    
  
}
export default Login;