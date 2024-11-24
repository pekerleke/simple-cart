import { useRouter } from "next/navigation";

const LanguageSelector = () => {
    const router = useRouter();

    const setLocaleCookie = (locale: string) => {
        // Configurar la cookie `locale`
        document.cookie = `locale=${locale}; path=/; max-age=${30 * 24 * 60 * 60};`; // Expira en 30 días

        // Refrescar la página para aplicar el cambio
        router.refresh(); // Forzar que el servidor lea la cookie actualizada
    };

    return (
        <div>
            <button onClick={() => setLocaleCookie("en")}>English</button>
            <button onClick={() => setLocaleCookie("es")}>Español</button>
            <button onClick={() => setLocaleCookie("pt")}>Portuges</button>
        </div>
    );
};

export default LanguageSelector;