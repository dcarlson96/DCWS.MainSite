(function () {
    async function checkApiStatus(): Promise<void> {
        const statusDot = document.getElementById("api-status-dot");

        if (!statusDot) {
            return;
        }

        statusDot.className = "api-status-dot api-status-waiting";
        statusDot.title = "Checking API status";

        const controller = new AbortController();
        const timeoutId = setTimeout(function () {
            controller.abort();
        }, 15000);

        try {
            const response = await fetch("https://api.dcwebsystems.com/api/status", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                signal: controller.signal
            });

            if (response.ok) {
                statusDot.className = "api-status-dot api-status-success";
                statusDot.title = "API online";
            } else {
                statusDot.className = "api-status-dot api-status-error";
                statusDot.title = "API returned " + response.status;
            }
        } catch (error: unknown) {
            statusDot.className = "api-status-dot api-status-error";

            if (error instanceof Error && error.name === "AbortError") {
                statusDot.title = "API request timed out";
            } else {
                statusDot.title = "API unavailable";
            }

            console.error("API status check failed:", error);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    function initMobileNav(): void {
        const toggle = document.querySelector<HTMLButtonElement>(".nav-toggle");
        const nav = document.getElementById("mobile-nav");

        if (!toggle || !nav) {
            return;
        }

        toggle.addEventListener("click", function () {
            const open = document.body.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", String(open));
            nav.setAttribute("aria-hidden", String(!open));
        });

        nav.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                document.body.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
                nav.setAttribute("aria-hidden", "true");
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        checkApiStatus();
        initMobileNav();
    });
})();
