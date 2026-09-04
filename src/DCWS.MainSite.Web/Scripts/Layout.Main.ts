document.addEventListener("DOMContentLoaded", function () {
    const statusApiUrl = window.AppConfig && window.AppConfig.apis
        ? window.AppConfig.apis.statusApi
        : "";

    const layout = new DCWS.ViewModels.LayoutViewModel(statusApiUrl);
    const addressLookupPage = document.getElementById("address-lookup-page");
    const testimonialsPage = document.getElementById("testimonials-page");

    if (addressLookupPage) {
        layout.addressLookup = new DCWS.ViewModels.AddressLookupViewModel(
            window.AppConfig.apis.addressLookupApi,
            window.AppConfig.arcGis.apiKey);
    }

    if (testimonialsPage) {
        layout.testimonialSubmission = new DCWS.ViewModels.TestimonialSubmissionViewModel(
            window.AppConfig.apis.testimonialsApi);
    }

    ko.applyBindings(layout, document.body);
});
