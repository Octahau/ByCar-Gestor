import { Login04 } from '@/components/login-04';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return <Login04 status={status} canResetPassword={canResetPassword} />;
}
