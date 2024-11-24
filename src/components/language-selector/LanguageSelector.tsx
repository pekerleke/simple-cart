import { getCookie } from "@/utils/getCookie";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FaUser } from "react-icons/fa";
import { InputPicker } from "rsuite";
import { GrLanguage } from "react-icons/gr";

const LanguageSelector = () => {
    const router = useRouter();
    const { t: translate } = useTranslation();
    const setLocaleCookie = (locale: string) => {
        document.cookie = `locale=${locale}; path=/; max-age=${30 * 24 * 60 * 60 * 365};`;
        router.refresh();
    };

    return (
        <InputPicker
            value={getCookie("locale")}
            data={[
                { label: translate("spanish"), value: "es" },
                { label: translate("portuguese"), value: "pt" },
                { label: translate("english"), value: "en" },
            ]}
            renderValue={(value, item: any) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <GrLanguage style={{ marginRight: 8 }} />
                   {item.label}
                </div>
            )}
            cleanable={false}
            onChange={value => setLocaleCookie(value)}
            block
        />
    );
};

export default LanguageSelector;