import { Register04 } from '@/components/register-04';

interface RegisterProps {
    status?: string;
}

export default function Register({ status }: RegisterProps) {
    return <Register04 status={status} />;
}
