import { useState } from 'react';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert } from 'react-native';
import { Center, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import Toast from 'react-native-toast-message'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

import { THEME } from '../styles/theme'

export function Register() {
    const [isLoading, setIsLoading] = useState(false)
    const [patrimony, setPatrimony] = useState('')
    const [description, setDescription] = useState('')

    const navigation = useNavigation()

    function handleNewOrderRegister() {
        if (!patrimony || !description) {
            return Toast.show({
                type: 'error',
                text1: 'Registrar',
                text2: 'Preencha todos os campos.'
            });
        }

        setIsLoading(true)

        firestore()
            .collection('orders')
            .add({
                patrimony,
                description,
                status: 'open',
                created_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Solicitação registrada com sucesso.',
                });
                navigation.goBack()
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
                return Alert.alert('Solicitação', 'Não foi possível registrar o pedido.')
            })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={THEME.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <VStack flex={1} p={2} bg="gray.600">
                    <Header title='Nova solicitação' />

                    <Input
                        placeholder='Número do patrimônio'
                        keyboardType="numeric"
                        mt={4}
                        onChangeText={setPatrimony}
                    />

                    <Input
                        placeholder='Descrição do problema'
                        flex={1}
                        mt={5}
                        multiline
                        textAlignVertical='top'
                        onChangeText={setDescription}
                    />

                    <Center>
                        <Button
                            title='Cadastrar'
                            mt={5}
                            isLoading={isLoading}
                            onPress={handleNewOrderRegister}
                        />
                    </Center>
                </VStack>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}