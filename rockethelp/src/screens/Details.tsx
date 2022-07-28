import { useEffect, useState } from 'react'
import { Alert } from 'react-native';
import { VStack, Text, HStack, useTheme, ScrollView, Box, IconButton } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard, Trash } from 'phosphor-react-native'

import Toast from 'react-native-toast-message'
import { dateFormat } from '../utils/firestoreDateFormat';

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading'
import { CardDetails } from '../components/CardDetails'

type RouteParams = {
    orderId: string
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string
}

export function Details() {
    const [solution, setSolution] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)

    const navigation = useNavigation()
    const { colors } = useTheme()
    const route = useRoute()

    const { orderId } = route.params as RouteParams

    function handleOrderClose() {
        if (!solution) {
            return Alert.alert('Encerrar', 'Informe a solução antes de encerrar.')
        }

        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(order.id)
            .update({
                status: 'closed',
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Solicitação encerrada com sucesso.',
                });
                navigation.goBack()
            })
            .catch((error) => {
                console.log(error)
                Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação.')
            })
    }

    function handleOrderReopen() {
        Alert.alert(
            "Reabrir",
            "Confirma a reabertura da solicitação?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sim", onPress: () => {
                        firestore()
                            .collection<OrderFirestoreDTO>('orders')
                            .doc(order.id)
                            .update({
                                status: 'open',
                                solution: '',
                                closed_at: null
                            })
                            .then(() => {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Solicitação reaberta com sucesso.',
                                });
                                navigation.goBack()
                            })
                            .catch((error) => {
                                console.log(error)
                                Alert.alert('Solicitação', 'Não foi possível reabrir a solicitação.')
                            })
                    }
                }
            ]
        );
    }

    function handleOrderDelete() {
        Alert.alert(
            "Excluir",
            "Confirma a exclusão da solicitação?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir", onPress: () => {
                        firestore()
                            .collection<OrderFirestoreDTO>('orders')
                            .doc(order.id)
                            .delete()
                            .then(() => {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Solicitação excluida com sucesso.',
                                });
                                navigation.goBack()
                            })
                            .catch((error) => {
                                console.log(error)
                                Alert.alert('Solicitação', 'Não foi possível excluir a solicitação.')
                            })
                    }
                }
            ]
        );
    }

    useEffect(() => {
        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .get()
            .then((doc) => {
                const { patrimony, description, status, created_at, closed_at, solution } = doc.data()

                const closed = closed_at ? dateFormat(closed_at) : null

                setOrder({
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    solution,
                    when: dateFormat(created_at),
                    closed
                })

                setIsLoading(false)
            })

    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600" borderBottomWidth={1} borderBottomColor={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}>
                <Header title='Solicitação' />
            </Box>

            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'closed'
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title='equipamento'
                    description={`Patrimômio ${order.patrimony}`}
                    icon={DesktopTower}
                    footer={order.when}
                />

                <CardDetails
                    title='descrição do problema'
                    description={order.description}
                    icon={Clipboard}
                />

                <CardDetails
                    title='solução'
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {
                        order.status === 'open' &&

                        <Input
                            placeholder='Descrição da solução'
                            onChangeText={setSolution}
                            textAlignVertical="top"
                            multiline
                            h={24}
                        />
                    }
                </CardDetails>
            </ScrollView>

            <HStack space={20} mt={10} mb={2} mx={5}>
                <IconButton
                    icon={<Trash size={26} color={colors.white} />}
                    rounded='sm'
                    variant='solid'
                    bg='red.900'
                    px={3}
                    _pressed={{ bg: 'red.500' }}
                    onPress={handleOrderDelete}
                />

                {
                    order.status === 'open' ?
                        <Button
                            title='Encerrar'
                            flex={1}
                            onPress={handleOrderClose}
                        />
                        :
                        <Button
                            title='Reabrir'
                            flex={1}
                            onPress={handleOrderReopen}
                        />
                }
            </HStack>
        </VStack>
    );
}