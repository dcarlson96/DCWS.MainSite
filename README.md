# DCWS.MainSite

The public website for DC Web Systems, built as a conventional server-rendered ASP.NET Core MVC application to showcase services, highlight portfolio projects, and provide information for prospective clients.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Visual Studio with the **ASP.NET and web development** workload, or any editor that supports the .NET CLI

Node.js and npm are not required.

## Run with Visual Studio

1. Clone the repository and open `DCWS.MainSite.sln`.
2. Confirm `DCWS.MainSite.Web` is the startup project.
3. Select the `DCWS.MainSite.Web` launch profile.
4. Press **F5** or the green Start button.

Visual Studio restores NuGet packages, starts the ASP.NET Core development server, opens the site in your configured browser, and supports normal C# breakpoints. The project launch profile uses `https://localhost:7173` and `http://localhost:5173`.

## Run with the .NET CLI

From the repository root:

```powershell
dotnet restore DCWS.MainSite.sln
dotnet build DCWS.MainSite.sln
dotnet test DCWS.MainSite.sln
dotnet run --project src/DCWS.MainSite.Web/DCWS.MainSite.Web.csproj
```

For automatic reload while editing:

```powershell
dotnet watch --project src/DCWS.MainSite.Web/DCWS.MainSite.Web.csproj
```

## Project structure

```text
DCWS.MainSite.sln
src/
  DCWS.MainSite.Web/
    Controllers/
    Models/
    Properties/
    Views/
      Home/
      Shared/
    wwwroot/
      css/
      fonts/
      images/
    Program.cs
    appsettings.json
    DCWS.MainSite.Web.csproj
tests/
  DCWS.MainSite.Web.Tests/
docs/
  deployment-migration.md
```

The site uses Razor views and plain CSS. It has no SPA, React, Vite, TypeScript, or client-side package-manager runtime. Add JavaScript under `wwwroot` only when a feature actually requires browser-side behavior.

## Tests

`DCWS.MainSite.Web.Tests` starts the MVC application in memory and verifies:

- the home page returns successful HTML;
- branding, metadata, navigation targets, and primary sections render; and
- CSS, fonts, and the favicon are served successfully.

Run the suite from Test Explorer or with `dotnet test DCWS.MainSite.sln`.

## Deployment

`.github/workflows/azure-app-service.yml` restores, builds, tests, and publishes the .NET 10 MVC web project, signs in to Azure with GitHub Actions OpenID Connect (OIDC), and deploys the published output to the Windows App Service `dcwebsystems-prod`. It runs after a push to `main` and can also be started manually from the GitHub Actions page. Manual runs must use the `main` branch; runs from any other ref are skipped.

Create these repository secrets under **Settings > Secrets and variables > Actions**:

| Secret | Value |
| --- | --- |
| `AZURE_CLIENT_ID` | Client ID of the Azure user-assigned managed identity |
| `AZURE_TENANT_ID` | Microsoft Entra directory (tenant) ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID containing the App Service |

No publish profile, client secret, service-principal password, GitHub PAT, or basic-authentication credential is used.

### Azure identity and access setup

1. In resource group `DCWebSystems`, create a user-assigned managed identity for this deployment workflow.
2. On that identity, add a federated credential for GitHub Actions with:
   - Issuer: `https://token.actions.githubusercontent.com`
   - Audience: `api://AzureADTokenExchange`
   - Subject: `repo:dcarlson96@62816103/DCWS.MainSite@1329375297:ref:refs/heads/main`
3. On App Service `dcwebsystems-prod`, open **Access control (IAM)** and assign the identity the **Website Contributor** role. Scope the assignment to this App Service resource, not the resource group or subscription.
4. Copy the identity's client ID, tenant ID, and subscription ID into the three GitHub repository secrets listed above.

The subject uses GitHub's immutable owner and repository IDs and permits Azure login only for workflows running from `main`. If the repository's GitHub OIDC settings preview a different subject, use that exact preview value for the Azure federated credential.

To deploy manually after the workflow is present on `main`, open **Actions > Deploy to Azure App Service > Run workflow**, select `main`, and choose **Run workflow**.

See [docs/deployment-migration.md](docs/deployment-migration.md) for the hosting migration and rollback plan.
