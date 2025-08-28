import { HTMLAttributes } from "react";

export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/logo-bycar.jpg"   // Ruta a tu logo (colócalo en public/logo.png)
            alt="ByCar Logo"
            className="h-12 w-auto" // Ajusta el tamaño como quieras
        />
    );
}