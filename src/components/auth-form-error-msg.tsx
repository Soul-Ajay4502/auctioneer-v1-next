import { FormMessage } from './ui/form'

interface AuthFormErrorMsgProps {
    message?: string
}

const AuthFormErrorMsg: React.FC<AuthFormErrorMsgProps> = () => {
    return <FormMessage className="text-[10px] text-red-500" />
}

export default AuthFormErrorMsg
