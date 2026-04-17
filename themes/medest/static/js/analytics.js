(function () {
    const config = window.medestConsentConfig;
    const measurementId = config && config.measurementId;

    if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId) || window.medestAnalyticsLoaded) {
        return;
    }

    window.medestAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

    const analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(analyticsScript);

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
    });
}());
