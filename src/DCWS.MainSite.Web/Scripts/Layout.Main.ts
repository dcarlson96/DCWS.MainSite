document.addEventListener("DOMContentLoaded", function () {
    const statusApiUrl = window.AppConfig && window.AppConfig.apis
        ? window.AppConfig.apis.statusApi
        : "";

    const layout = new DCWS.ViewModels.LayoutViewModel(statusApiUrl);

    ko.applyBindings(layout, document.body);
});
