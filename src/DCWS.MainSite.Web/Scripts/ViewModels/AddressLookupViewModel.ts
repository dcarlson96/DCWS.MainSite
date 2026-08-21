interface AddressLookupResult {
    matchedAddress: string | null;
    latitude: number | null;
    longitude: number | null;
    county: string | null;
    state: string | null;
    congressionalDistrict: string | null;
    stateHouseDistrict: string | null;
    stateSenateDistrict: string | null;
}

interface ApiResponse<T> {
    item: T | null;
    wasSuccessful: boolean;
    message: string | null;
    validationIssues: unknown;
}

interface ArcGisModuleLoader {
    import(modulePaths: string[]): Promise<unknown[]>;
}

interface ArcGisSdkConfig {
    apiKey: string;
}

interface ArcGisGraphicsCollection {
    add(graphic: unknown): void;
    removeAll(): void;
}

interface ArcGisMapView {
    graphics: ArcGisGraphicsCollection;
    goTo(target: Record<string, unknown>, options?: Record<string, unknown>): Promise<void>;
    resize(): void;
    when(): Promise<unknown>;
}

type ArcGisConstructor<T> = new (properties: Record<string, unknown>) => T;

interface Window {
    $arcgis?: ArcGisModuleLoader;
}

namespace DCWS.ViewModels {
    export class AddressLookupViewModel {
        public street = ko.observable<string>("");
        public city = ko.observable<string>("");
        public state = ko.observable<string>("");
        public zipCode = ko.observable<string>("");

        public streetError = ko.observable<string>("");
        public cityError = ko.observable<string>("");
        public stateError = ko.observable<string>("");
        public zipCodeError = ko.observable<string>("");
        public errorMessages = ko.observableArray<string>([]);
        public mapError = ko.observable<string>("");

        public isLoading = ko.observable<boolean>(false);
        public hasResult = ko.observable<boolean>(false);

        public matchedAddress = ko.observable<string>("");
        public county = ko.observable<string>("");
        public resultState = ko.observable<string>("");
        public congressionalDistrict = ko.observable<string>("");
        public stateHouseDistrict = ko.observable<string>("");
        public stateSenateDistrict = ko.observable<string>("");

        private mapView: ArcGisMapView | null = null;

        constructor(
            private readonly addressLookupApiUrl: string,
            private readonly arcGisApiKey: string) {
        }

        public submit = (): void => {
            if (this.isLoading() || !this.validate()) {
                return;
            }

            if (!this.addressLookupApiUrl) {
                this.errorMessages(["The address lookup service is not configured."]);
                return;
            }

            this.isLoading(true);
            this.hasResult(false);
            this.errorMessages([]);
            this.mapError("");

            $.ajax({
                method: "GET",
                url: this.addressLookupApiUrl,
                data: {
                    Street: this.street().trim(),
                    City: this.city().trim(),
                    State: this.state(),
                    ZipCode: this.zipCode().trim()
                },
                headers: {
                    Accept: "application/json"
                },
                timeout: 20000
            })
                .done((response: ApiResponse<AddressLookupResult>) => {
                    void this.handleSuccess(response)
                        .catch(() => {
                            this.errorMessages(["The lookup result could not be displayed. Please try again."]);
                        })
                        .finally(() => {
                            this.isLoading(false);
                        });
                })
                .fail((xhr: JQueryXHR) => {
                    this.handleFailure(xhr);
                    this.isLoading(false);
                });
        };

        private validate(): boolean {
            this.streetError("");
            this.cityError("");
            this.stateError("");
            this.zipCodeError("");
            this.errorMessages([]);

            if (!this.street().trim()) {
                this.streetError("Enter a street address.");
            }

            if (!this.city().trim()) {
                this.cityError("Enter a city.");
            }

            if (!this.state()) {
                this.stateError("Select a state.");
            }

            const zipCode = this.zipCode().trim();
            if (!zipCode) {
                this.zipCodeError("Enter a ZIP Code.");
            } else if (!/^\d{5}(?:-\d{4})?$/.test(zipCode)) {
                this.zipCodeError("Enter a 5-digit ZIP Code or ZIP+4.");
            }

            return !this.streetError() && !this.cityError() && !this.stateError() && !this.zipCodeError();
        }

        private async handleSuccess(response: ApiResponse<AddressLookupResult>): Promise<void> {
            if (!response || response.wasSuccessful !== true || !response.item) {
                const issues = this.collectValidationIssues(response ? response.validationIssues : null);
                const fallback = response && response.message
                    ? response.message
                    : "No matching address was returned. Check the address and try again.";

                this.errorMessages(issues.length > 0 ? issues : [fallback]);
                return;
            }

            const item = response.item;
            if (!item.matchedAddress
                || typeof item.latitude !== "number"
                || !Number.isFinite(item.latitude)
                || typeof item.longitude !== "number"
                || !Number.isFinite(item.longitude)) {
                this.errorMessages(["The lookup service returned an incomplete address result. Please try again."]);
                return;
            }

            this.matchedAddress(item.matchedAddress);
            this.county(this.displayValue(item.county));
            this.resultState(this.displayValue(item.state));
            this.congressionalDistrict(this.displayValue(item.congressionalDistrict));
            this.stateHouseDistrict(this.displayValue(item.stateHouseDistrict));
            this.stateSenateDistrict(this.displayValue(item.stateSenateDistrict));
            this.hasResult(true);

            await this.afterDomUpdate();
            await this.updateMap(item.longitude, item.latitude, item.matchedAddress);
        }

        private handleFailure(xhr: JQueryXHR): void {
            const response = xhr.responseJSON as ApiResponse<AddressLookupResult> | undefined;
            const issues = response ? this.collectValidationIssues(response.validationIssues) : [];

            if (issues.length > 0) {
                this.errorMessages(issues);
            } else if (response && response.message) {
                this.errorMessages([response.message]);
            } else if (xhr.statusText === "timeout") {
                this.errorMessages(["The address lookup took too long. Please try again."]);
            } else if (xhr.status === 0) {
                this.errorMessages(["The address lookup service could not be reached. Check your connection and try again."]);
            } else {
                this.errorMessages(["The address lookup service is temporarily unavailable. Please try again."]);
            }
        }

        private collectValidationIssues(value: unknown): string[] {
            if (typeof value === "string" && value.trim()) {
                return [value.trim()];
            }

            if (Array.isArray(value)) {
                return value.flatMap((issue: unknown) => this.collectValidationIssues(issue));
            }

            if (value && typeof value === "object") {
                const issue = value as Record<string, unknown>;
                const preferredValue = issue.message ?? issue.errorMessage ?? issue.errors;

                if (preferredValue !== undefined) {
                    return this.collectValidationIssues(preferredValue);
                }

                return Object.values(issue).flatMap((entry: unknown) => this.collectValidationIssues(entry));
            }

            return [];
        }

        private displayValue(value: string | null): string {
            return value && value.trim() ? value : "Not available";
        }

        private afterDomUpdate(): Promise<void> {
            return new Promise((resolve: () => void) => window.requestAnimationFrame(() => resolve()));
        }

        private async updateMap(longitude: number, latitude: number, matchedAddress: string): Promise<void> {
            if (!this.arcGisApiKey) {
                this.mapError("The map is unavailable because the ArcGIS API key is not configured.");
                return;
            }

            const container = document.getElementById("address-map");
            if (!container) {
                this.mapError("The map could not be displayed.");
                return;
            }

            try {
                const loader = await this.getArcGisLoader();
                const modules = await loader.import([
                    "@arcgis/core/config.js",
                    "@arcgis/core/Map.js",
                    "@arcgis/core/views/MapView.js",
                    "@arcgis/core/Graphic.js"
                ]);

                const config = modules[0] as ArcGisSdkConfig;
                const Map = modules[1] as ArcGisConstructor<unknown>;
                const MapView = modules[2] as ArcGisConstructor<ArcGisMapView>;
                const Graphic = modules[3] as ArcGisConstructor<unknown>;

                config.apiKey = this.arcGisApiKey;

                if (!this.mapView) {
                    const map = new Map({ basemap: "arcgis/navigation" });
                    this.mapView = new MapView({
                        container: container,
                        map: map,
                        center: [longitude, latitude],
                        zoom: 16
                    });
                }

                await this.mapView.when();
                this.mapView.resize();

                const marker = new Graphic({
                    geometry: {
                        type: "point",
                        longitude: longitude,
                        latitude: latitude
                    },
                    symbol: {
                        type: "simple-marker",
                        style: "circle",
                        color: "#2959ff",
                        size: 14,
                        outline: {
                            color: "#ffffff",
                            width: 3
                        }
                    },
                    attributes: {
                        matchedAddress: matchedAddress
                    },
                    popupTemplate: {
                        title: "Matched address",
                        content: "{matchedAddress}"
                    }
                });

                this.mapView.graphics.removeAll();
                this.mapView.graphics.add(marker);
                await this.mapView.goTo(
                    { center: [longitude, latitude], zoom: 16 },
                    { duration: 500 });
            } catch {
                this.mapError("The location was found, but the map could not be loaded.");
            }
        }

        private async getArcGisLoader(): Promise<ArcGisModuleLoader> {
            for (let attempt = 0; attempt < 50; attempt++) {
                if (window.$arcgis) {
                    return window.$arcgis;
                }

                await new Promise<void>((resolve: () => void) => {
                    window.setTimeout(resolve, 100);
                });
            }

            throw new Error("ArcGIS Maps SDK did not load.");
        }
    }
}
