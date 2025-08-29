import { Head } from '@inertiajs/react';
import Login from './auth/login';

export default function Welcome() {
    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen items-center justify-center bg-[#FDFDFC] dark:bg-[#0a0a0a] p-6 lg:p-8">
                <div className="w-full max-w-md">
                    <Login status={''} canResetPassword={true} />
                </div>
            </div>
        </>
    );
}
