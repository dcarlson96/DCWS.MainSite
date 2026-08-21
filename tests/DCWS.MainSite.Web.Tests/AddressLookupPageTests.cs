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
    public async Task AddressLookupPage_RendersFormMapDependenciesAndBrowserConfiguration()
    {
        var response = await _client.GetAsync("/address-lookup");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/html", response.Content.Headers.ContentType?.MediaType);
        Assert.Contains("<title>Address &amp; District Lookup | DC Web Systems</title>", html);
        Assert.Contains("id=\"address-lookup-page\"", html);
        Assert.Contains("name=\"Street\"", html);
        Assert.Contains("name=\"City\"", html);
        Assert.Contains("name=\"State\"", html);
        Assert.Contains("name=\"ZipCode\"", html);
        Assert.Contains("https://js.arcgis.com/5.1/", html);
        Assert.Contains("data-address-lookup-api=\"https://api.dcwebsystems.com/api/address/lookup\"", html);
        Assert.Contains("data-arcgis-api-key=\"\"", html);
        Assert.Contains("/js/ViewModels/AddressLookupViewModel.js", html);
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
}
