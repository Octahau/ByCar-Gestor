import { ResetPassword04 } from '@/components/reset-password-04';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return <ResetPassword04 token={token} email={email} />;
}
