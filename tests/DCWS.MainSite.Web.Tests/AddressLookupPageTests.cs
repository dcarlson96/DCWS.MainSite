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
}
