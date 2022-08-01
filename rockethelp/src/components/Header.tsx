import { Heading, HStack, IconButton, useTheme, StyledProps } from 'native-base';
import { CaretLeft, Trash } from 'phosphor-react-native'
import { useNavigation } from '@react-navigation/native'

type Props = StyledProps & {
    title: string
    showTrashIcon?: boolean
    onTrashPress?: any
}

export function Header({ title, showTrashIcon, onTrashPress, ...rest }: Props) {
    const { colors } = useTheme()
    const navigation = useNavigation()

    function handleGoBack() {
        navigation.goBack()
    }

    return (
        <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pb={6}
            pt={12}
            {...rest}
        >
            <IconButton
                w='15%'
                icon={<CaretLeft color={colors.gray[200]} size={24} />}
                rounded={100}
                onPress={handleGoBack}
            />

            <Heading
                color="gray.100"
                textAlign="center"
                fontSize="lg"
                flex={1}
                ml={showTrashIcon ? '0' : '-8'}
            >
                {title}
            </Heading>

            {
                showTrashIcon &&
                <IconButton
                    icon={<Trash color={colors.gray[200]} size={24} />}
                    mr={2}
                    rounded={100}
                    onPress={onTrashPress}
                />
            }
        </HStack>
    );
}