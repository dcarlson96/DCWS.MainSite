interface ApiConfig {
    statusApi: string;
}

interface ApplicationConfig {
    apis: ApiConfig;
}

interface Window {
    AppConfig: ApplicationConfig;
}

(function () {
    window.AppConfig = window.AppConfig || { apis: { statusApi: "" } };
    window.AppConfig.apis = window.AppConfig.apis || { statusApi: "" };

    const configElement = document.getElementById("api-config");

    if (configElement) {
        window.AppConfig.apis.statusApi = configElement.dataset.statusApi || "";
    }
})();
