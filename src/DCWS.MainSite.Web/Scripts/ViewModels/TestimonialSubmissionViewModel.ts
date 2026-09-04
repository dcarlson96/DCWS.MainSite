interface TestimonialSubmitApiResponse {
    wasSuccessful: boolean;
    message: string | null;
}

interface TestimonialSubmitRequest {
    name: string;
    review: string;
    website: string;
}

namespace DCWS.ViewModels {
    export class TestimonialSubmissionViewModel {
        public name = ko.observable<string>("");
        public review = ko.observable<string>("");
        public website = ko.observable<string>("");

        public nameError = ko.observable<string>("");
        public reviewError = ko.observable<string>("");
        public errorMessage = ko.observable<string>("");
        public successMessage = ko.observable<string>("");

        public isModalOpen = ko.observable<boolean>(false);
        public isSubmitting = ko.observable<boolean>(false);

        private opener: HTMLElement | null = null;

        constructor(private readonly testimonialsApiUrl: string) {
        }

        public openModal = (): void => {
            this.opener = document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
            this.clearValidation();
            this.successMessage("");
            this.isModalOpen(true);
            document.body.classList.add("testimonial-modal-open");

            window.setTimeout(() => {
                document.getElementById("testimonial-name")?.focus();
            }, 0);
        };

        public closeModal = (): void => {
            if (this.isSubmitting()) {
                return;
            }

            this.closeModalInternal();
        };

        public closeFromBackdrop = (_viewModel: unknown, event: Event): boolean => {
            if (event.target === event.currentTarget) {
                this.closeModal();
            }

            return true;
        };

        public stopPropagation = (_viewModel: unknown, event: Event): boolean => {
            event.stopPropagation();
            return true;
        };

        public handleKeydown = (_viewModel: unknown, event: KeyboardEvent): boolean => {
            if (event.key === "Escape") {
                event.preventDefault();
                this.closeModal();
                return false;
            }

            if (event.key === "Tab") {
                this.keepFocusInModal(event);
            }

            return true;
        };

        public submit = (): void => {
            if (this.isSubmitting() || !this.validate()) {
                return;
            }

            if (!this.testimonialsApiUrl) {
                this.errorMessage("Testimonial submissions are temporarily unavailable. Please try again later.");
                return;
            }

            this.isSubmitting(true);
            this.errorMessage("");
            const request: TestimonialSubmitRequest = {
                name: this.name().trim(),
                review: this.review().trim(),
                website: this.website()
            };

            $.ajax({
                method: "POST",
                url: this.testimonialsApiUrl,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(request),
                headers: {
                    Accept: "application/json"
                },
                timeout: 20000
            })
                .done((response: TestimonialSubmitApiResponse) => {
                    if (!response || response.wasSuccessful !== true) {
                        this.errorMessage("We couldn't submit your testimonial. Please try again.");
                        return;
                    }

                    this.name("");
                    this.review("");
                    this.website("");
                    this.successMessage("Thanks! Your testimonial has been submitted for review.");
                    this.isSubmitting(false);
                    this.closeModalInternal();

                    window.setTimeout(() => {
                        document.getElementById("testimonial-success")?.focus();
                    }, 0);
                })
                .fail(() => {
                    this.errorMessage("We couldn't submit your testimonial. Please check your connection and try again.");
                })
                .always(() => {
                    this.isSubmitting(false);
                });
        };

        private validate(): boolean {
            this.clearValidation();
            const name = this.name().trim();
            const review = this.review().trim();

            if (!name) {
                this.nameError("Enter your name.");
            } else if (name.length > 100) {
                this.nameError("Name cannot exceed 100 characters.");
            }

            if (!review) {
                this.reviewError("Enter your testimonial.");
            } else if (review.length > 2000) {
                this.reviewError("Review cannot exceed 2,000 characters.");
            }

            if (this.nameError()) {
                document.getElementById("testimonial-name")?.focus();
            } else if (this.reviewError()) {
                document.getElementById("testimonial-review")?.focus();
            }

            return !this.nameError() && !this.reviewError();
        }

        private clearValidation(): void {
            this.nameError("");
            this.reviewError("");
            this.errorMessage("");
        }

        private closeModalInternal(): void {
            this.isModalOpen(false);
            document.body.classList.remove("testimonial-modal-open");

            const opener = this.opener;
            this.opener = null;
            window.setTimeout(() => opener?.focus(), 0);
        }

        private keepFocusInModal(event: KeyboardEvent): void {
            const modal = document.getElementById("testimonial-modal");

            if (!modal) {
                return;
            }

            const focusable = Array.from(modal.querySelectorAll<HTMLElement>(
                "button:not([disabled]), input:not([disabled]):not([tabindex='-1']), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"));

            if (focusable.length === 0) {
                event.preventDefault();
                modal.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }
}
