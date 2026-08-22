using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DCWS.MainSite.Web.Tests;

public sealed class AddressLookupPageTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public AddressLookupPageTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost")
        });
    }

    [Fact]
    public async Task PortfolioPage_LinksToAddressLookup()
    {
        var response = await _client.GetAsync("/Portfolio");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("Address &amp; District Lookup", html);
        Assert.Contains("href=\"/address-lookup\"", html);
    }

    [Fact]
    public async Task PortfolioPage_ShowsOnlyPublishedProjectsWithSafeOutageMapDisclosure()
    {
        var response = await _client.GetAsync("/Portfolio");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("Address &amp; District Lookup", html);
        Assert.Contains("Utility Outage Map", html);
        Assert.Contains("The Idaho Power outage map is an Idaho Power product.", html);
        Assert.Contains("DC Web Systems is an independent portfolio site and is not affiliated with or endorsed by Idaho Power.", html);
        Assert.Contains("href=\"https://tools.idahopower.com/outage\" target=\"_blank\" rel=\"noopener noreferrer\"", html);
        Assert.DoesNotContain("Project Title", html);
        Assert.Equal(2, CountOccurrences(html, "<article class=\"portfolio-item\""));
    }

    private static int CountOccurrences(string value, string searchValue) =>
        value.Split(searchValue, StringSplitOptions.None).Length - 1;
}
