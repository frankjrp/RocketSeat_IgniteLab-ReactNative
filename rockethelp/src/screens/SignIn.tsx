import { useState } from "react";
import auth from '@react-native-firebase/auth'
import { Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { Heading, Icon, VStack, useTheme } from "native-base";
import { Envelope, Key } from 'phosphor-react-native'

import Logo from '../assets/logo_primary.svg'
import { THEME } from '../styles/theme'

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { colors } = useTheme()

    function handleSignIn() {
        if (!email || !password) {
            return Alert.alert('Entrar', 'Informe e-mail e senha.')
        }

        setIsLoading(true)

        auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                console.log(error.code)
                setIsLoading(false)

                if (error.code === 'auth/invalid-email') {
                    return Alert.alert('Entrar', 'E-mail inválido.')
                }

                if (error.code === 'auth/wrong-password') {
                    return Alert.alert('Entrar', 'E-mail ou senha inválida.')
                }

                if (error.code === 'auth/user-not-found') {
                    return Alert.alert('Entrar', 'E-mail ou senha inválida.')
                }

                return Alert.alert('Entrar', 'Não foi possível acessar com os dados informados.')
            })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={THEME.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <VStack flex={1} alignItems="center" justifyContent="center" bg="gray.600" px={8} pb="15%">
                    <Logo />

                    <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                        Acesse sua conta
                    </Heading>

                    <Input
                        mb={4}
                        placeholder="E-mail"
                        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                        keyboardType="email-address"
                        onChangeText={setEmail}
                    />

                    <Input
                        mb={8}
                        placeholder="Senha"
                        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                        secureTextEntry
                        keyboardType="numeric"
                        onChangeText={setPassword}
                    />

                    <Button
                        title="Entrar"
                        w="full"
                        onPress={handleSignIn}
                        isLoading={isLoading}
                    />
                </VStack>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}