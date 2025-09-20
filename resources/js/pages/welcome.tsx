import { Login04 } from '@/components/login-04';

interface WelcomeProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Welcome({ status, canResetPassword }: WelcomeProps) {
    return <Login04 status={status} canResetPassword={canResetPassword} />;
}
