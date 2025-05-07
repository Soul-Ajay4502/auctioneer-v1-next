import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function axiosErrorToast(error: AxiosError, fallbackMessage = 'Something went wrong') {
    const message = (error.response?.data as { message?: string })?.message || fallbackMessage
    toast.error(message)
}
