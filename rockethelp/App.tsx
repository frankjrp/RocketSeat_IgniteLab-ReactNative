import { NativeBaseProvider, StatusBar } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Routes } from './src/routes'
import { Loading } from './src/components/Loading'
import { THEME } from './src/styles/theme'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })
  const { colors } = THEME

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: colors.green[700], borderLeftWidth: 8 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 18,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 15,
          fontWeight: '400'
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red', borderLeftWidth: 8 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 18,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 15,
          fontWeight: '400'
        }}
      />
    )
  }

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {fontsLoaded ? <Routes /> : <Loading />}

      <Toast config={toastConfig} />
    </NativeBaseProvider>
  );
}
