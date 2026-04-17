(function () {
    const config = window.medestConsentConfig;
    if (!config || !Array.isArray(config.items) || config.items.length === 0) {
        return;
    }

    const root = document.querySelector("[data-consent-root]");
    if (!root) {
        return;
    }

    const banner = root.querySelector("[data-consent-banner]");
    const settings = root.querySelector("[data-consent-settings]");
    const manageLinks = document.querySelectorAll(".manage-consent");
    const loadedKeys = new Set();

    function normalizeConsent(rawConsent) {
        const consent = {};

        config.items.forEach((item) => {
            consent[item.key] = item.required || Boolean(rawConsent && rawConsent[item.key]);
        });

        return consent;
    }

    function getCookie(name) {
        const prefix = `${name}=`;
        const parts = document.cookie.split(";").map((part) => part.trim());
        const match = parts.find((part) => part.indexOf(prefix) === 0);
        return match ? decodeURIComponent(match.slice(prefix.length)) : null;
    }

    function setCookie(name, value, days) {
        const maxAge = days * 24 * 60 * 60;
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    function serializeConsent(consent) {
        return config.items
            .map((item) => `${encodeURIComponent(item.key)}:${consent[item.key] ? "1" : "0"}`)
            .join(",");
    }

    function parseConsent(value) {
        if (!value) {
            return null;
        }

        const rawConsent = {};
        value.split(",").forEach((entry) => {
            const parts = entry.split(":");
            if (parts.length !== 2) {
                return;
            }

            rawConsent[decodeURIComponent(parts[0])] = parts[1] === "1";
        });

        return normalizeConsent(rawConsent);
    }

    function findCheckbox(key) {
        return Array.from(root.querySelectorAll("[data-consent-checkbox]")).find((checkbox) => checkbox.getAttribute("data-consent-checkbox") === key);
    }

    function syncCheckboxes(consent) {
        config.items.forEach((item) => {
            const checkbox = findCheckbox(item.key);
            if (!checkbox) {
                return;
            }

            checkbox.checked = consent[item.key];
        });
    }

    function loadScript(item) {
        if (!item.scriptFile || loadedKeys.has(item.key)) {
            return;
        }

        const existing = Array.from(document.querySelectorAll("script[data-consent-script-loaded]")).find((script) => script.dataset.consentScriptLoaded === item.key);
        if (existing) {
            loadedKeys.add(item.key);
            return;
        }

        const script = document.createElement("script");
        script.src = `${config.scriptBase}${item.scriptFile}`;
        script.defer = true;
        script.dataset.consentScriptLoaded = item.key;
        document.body.appendChild(script);
        loadedKeys.add(item.key);
    }

    function applyConsent(consent) {
        syncCheckboxes(consent);

        config.items.forEach((item) => {
            if (consent[item.key]) {
                loadScript(item);
            }
        });
    }

    function hidePanels() {
        root.hidden = true;
        banner.hidden = true;
        settings.hidden = true;
    }

    function showBanner() {
        root.hidden = false;
        banner.hidden = false;
        settings.hidden = true;
    }

    function showSettings() {
        root.hidden = false;
        banner.hidden = true;
        settings.hidden = false;
    }

    function currentConsentFromInputs() {
        const consent = {};

        config.items.forEach((item) => {
            const checkbox = findCheckbox(item.key);
            consent[item.key] = item.required || Boolean(checkbox && checkbox.checked);
        });

        return consent;
    }

    function saveConsent(consent) {
        const normalizedConsent = normalizeConsent(consent);
        setCookie(config.cookieName, serializeConsent(normalizedConsent), config.expirationDays);
        applyConsent(normalizedConsent);
        hidePanels();
    }

    root.querySelectorAll("[data-consent-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.getAttribute("data-consent-action");

            if (action === "deny") {
                saveConsent({});
                return;
            }

            if (action === "accept-all") {
                const allConsent = {};
                config.items.forEach((item) => {
                    allConsent[item.key] = true;
                });
                saveConsent(allConsent);
                return;
            }

            if (action === "settings") {
                showSettings();
                return;
            }

            if (action === "close-settings") {
                const existingConsent = parseConsent(getCookie(config.cookieName));
                if (existingConsent) {
                    hidePanels();
                } else {
                    showBanner();
                }
                return;
            }

            if (action === "save") {
                saveConsent(currentConsentFromInputs());
            }
        });
    });

    manageLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            showSettings();
        });
    });

    const storedConsent = parseConsent(getCookie(config.cookieName));
    if (storedConsent) {
        applyConsent(storedConsent);
        hidePanels();
    } else {
        syncCheckboxes(normalizeConsent({}));
        showBanner();
    }

    if (window.location.hash === "#manage-consent") {
        showSettings();
    }
}());
