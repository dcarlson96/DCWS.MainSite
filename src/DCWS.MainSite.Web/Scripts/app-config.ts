interface ApiConfig {
    statusApi: string;
    addressLookupApi: string;
}

interface ArcGisConfig {
    apiKey: string;
}

interface ApplicationConfig {
    apis: ApiConfig;
    arcGis: ArcGisConfig;
}

interface Window {
    AppConfig: ApplicationConfig;
}

(function () {
    window.AppConfig = window.AppConfig || {
        apis: { statusApi: "", addressLookupApi: "" },
        arcGis: { apiKey: "" }
    };
    window.AppConfig.apis = window.AppConfig.apis || { statusApi: "", addressLookupApi: "" };
    window.AppConfig.arcGis = window.AppConfig.arcGis || { apiKey: "" };

    const configElement = document.getElementById("api-config");

    if (configElement) {
        window.AppConfig.apis.statusApi = configElement.dataset.statusApi || "";
        window.AppConfig.apis.addressLookupApi = configElement.dataset.addressLookupApi || "";
        window.AppConfig.arcGis.apiKey = configElement.dataset.arcgisApiKey || "";
    }
})();
