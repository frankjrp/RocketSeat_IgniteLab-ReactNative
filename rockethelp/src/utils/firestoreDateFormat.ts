import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export function dateFormat(timestamp: FirebaseFirestoreTypes.Timestamp) {
    if (timestamp) {
        const date = new Date(timestamp.toDate())

        const dateFormatted = format(date, "dd'/'MM'/'yyyy' • 'HH':'mm", {
            locale: ptBR,
        })

        return dateFormatted
    }
}