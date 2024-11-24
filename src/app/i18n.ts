import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18n } from '../../i18n';

export default async function initTranslations(
    locale: any,
    i18nInstance?: any,
    resources?: any
) {
    i18nInstance = i18nInstance || createInstance();

    i18nInstance.use(initReactI18next);

    if (!resources) {
        i18nInstance.use(
            resourcesToBackend(
                (language: string) =>
                    import(`@/locales/${language}.json`)
            )
        );
    }

    await i18nInstance.init({
        lng: locale,
        resources,
        fallbackLng: i18n.defaultLocale,
        supportedLngs: i18n.locales,
        preload: resources ? [] : i18n.locales
    });

    return {
        i18n: i18nInstance,
        resources: i18nInstance.services.resourceStore.data,
        t: i18nInstance.t
    };
}