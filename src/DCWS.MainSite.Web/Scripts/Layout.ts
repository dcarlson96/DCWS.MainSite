namespace DCWS.ViewModels {
    export class LayoutViewModel {

        public statusDotClass = ko.observable<string>("api-status-dot api-status-waiting");
        public statusTitle = ko.observable<string>("Checking API status");
        public navOpen = ko.observable<boolean>(false);
        public addressLookup: AddressLookupViewModel | null = null;

        constructor(private readonly statusApiUrl: string) {
            this.init();
        }

        private init(): void {
            this.initClickHandlers();
            this.checkApiStatus();
        }

        private initClickHandlers(): void {
            // Header/nav interactions are wired declaratively through
            // Knockout bindings (toggleNav / closeNav) in the Razor view.
        }

        public toggleNav = (): void => {
            this.navOpen(!this.navOpen());
        };

        public closeNav = (): boolean => {
            this.navOpen(false);

            // Returning true allows the default anchor navigation to proceed.
            return true;
        };

        private checkApiStatus(): void {
            if (!this.statusApiUrl) {
                this.statusDotClass("api-status-dot api-status-error");
                this.statusTitle("API status endpoint not configured");
                return;
            }

            $.ajax({
                method: "GET",
                url: this.statusApiUrl,
                headers: {
                    Accept: "application/json"
                },
                timeout: 15000
            })
                .done(() => {
                    this.statusDotClass("api-status-dot api-status-success");
                    this.statusTitle("API online");
                })
                .fail((xhr: JQueryXHR) => {
                    this.statusDotClass("api-status-dot api-status-error");

                    if (xhr.statusText === "timeout") {
                        this.statusTitle("API request timed out");
                    } else if (xhr.status) {
                        this.statusTitle("API returned " + xhr.status);
                    } else {
                        this.statusTitle("API unavailable");
                    }
                });
        }
    }
}
