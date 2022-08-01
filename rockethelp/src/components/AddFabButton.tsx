import { Fab, IFabProps, Icon, Container } from 'native-base';

type Props = IFabProps & {
    icon: any
}

export function AddFabButton({ icon, ...rest }: Props) {
    return (
        <Container h={0} w={100}>
            <Fab
                bg="green.700"
                _pressed={{ bg: "green.500" }}
                icon={icon}
                {...rest}
            />
        </Container>
    );
}