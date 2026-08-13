(function () {
    async function checkApiStatus() {
        var statusDot = document.getElementById("api-status-dot");

        if (!statusDot) {
            return;
        }

        statusDot.className = "api-status-dot api-status-waiting";
        statusDot.title = "Checking API status";

        var controller = new AbortController();
        var timeoutId = setTimeout(function () {
            controller.abort();
        }, 15000);

        try {
            var response = await fetch("https://api.dcwebsystems.com/api/status", {
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
        } catch (error) {
            statusDot.className = "api-status-dot api-status-error";

            if (error.name === "AbortError") {
                statusDot.title = "API request timed out";
            } else {
                statusDot.title = "API unavailable";
            }

            console.error("API status check failed:", error);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    document.addEventListener("DOMContentLoaded", checkApiStatus);
})();
