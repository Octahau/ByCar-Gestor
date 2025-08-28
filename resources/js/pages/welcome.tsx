import Login from '@/pages/auth/login';
export default function Page() {
    interface LoginProps {
        status?: string;
        canResetPassword?: boolean; // <-- opcional
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Login canResetPassword={true} status="" />
            </div>
        </div>
    );
}
