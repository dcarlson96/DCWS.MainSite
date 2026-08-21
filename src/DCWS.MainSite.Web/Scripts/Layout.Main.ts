document.addEventListener("DOMContentLoaded", function () {
    const statusApiUrl = window.AppConfig && window.AppConfig.apis
        ? window.AppConfig.apis.statusApi
        : "";

    const layout = new DCWS.ViewModels.LayoutViewModel(statusApiUrl);
    const addressLookupPage = document.getElementById("address-lookup-page");

    if (addressLookupPage) {
        layout.addressLookup = new DCWS.ViewModels.AddressLookupViewModel(
            window.AppConfig.apis.addressLookupApi,
            window.AppConfig.arcGis.apiKey);
    }

    ko.applyBindings(layout, document.body);
});
