import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { ToastContainer } from "toastify-react-native";
export default function RootLayout() {
  return <SafeAreaProvider>
  
    <SafeScreen>
      
     <Stack screenOptions={{headerShown:false}}>
    
    <Stack.Screen name="(auth)" />
    <Stack.Screen name="(tabs)" />
    
  </Stack>
  </SafeScreen>
  </SafeAreaProvider>
 
}