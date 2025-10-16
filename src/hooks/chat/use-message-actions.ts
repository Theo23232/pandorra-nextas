import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/use-toast'

export function useMessageActions() {
    const { t } = useTranslation()
    const { toast } = useToast()

    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content).then(r => {
            toast({
                title: t('Copied'),
                description: t('MessageType copied to clipboard'),
                variant: 'success',
            })
        })

    }
    const showError = (message: string) => {
        toast({
            title: t('Error'),
            description: message,
            variant: 'error',
        })
    }

    const showSuccess = (message: string) => {
        toast({
            title: '',
            description: message,
            variant: 'success',
            duration: 3000,
        })
    }

    return {
        copyMessage,
        showError,
        showSuccess,
    }
}
