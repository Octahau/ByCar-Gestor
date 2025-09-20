import { ForgotPassword04 } from '@/components/forgot-password-04';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    return <ForgotPassword04 status={status} />;
}
