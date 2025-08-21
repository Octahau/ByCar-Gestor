import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { initializeTheme } from './hooks/use-appearance';
import AppLayout from './layouts/app-layout';
import Vehiculos from './pages/vehiculos';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
function App() {
    return (
        <>
            <Toaster
                position="top-right" // posición de los toasts
                toastOptions={{
                    duration: 3000, // tiempo que dura
                    style: {
                        fontSize: '14px',
                        borderRadius: '8px',
                    },
                }}
            />
            <AppLayout>
                <Vehiculos />
            </AppLayout>{' '}
        </>
    );
}

export default App;
