using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

namespace DCWS.MainSite.Web.Tests;

public sealed class TestimonialsPageTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TestimonialsPageTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost")
        });
    }

    [Fact]
    public async Task TestimonialsPage_RendersSubmissionModalWithoutPublishingInactiveExample()
    {
        var response = await _client.GetAsync("/testimonials");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("<title>Testimonials | DC Web Systems</title>", html);
        Assert.Contains("What Clients <em>Say</em>", html);
        Assert.Contains("id=\"add-testimonial-button\"", html);
        Assert.Contains("id=\"testimonial-modal\"", html);
        Assert.Contains("maxlength=\"100\"", html);
        Assert.Contains("maxlength=\"2000\"", html);
        Assert.Contains("will not be published automatically", html);
        Assert.DoesNotContain("Replace this inactive example", html);
    }

    [Theory]
    [InlineData("/")]
    [InlineData("/Portfolio")]
    [InlineData("/address-lookup")]
    [InlineData("/testimonials")]
    public async Task SharedNavigation_IncludesDesktopAndMobileTestimonialsLinks(string path)
    {
        var response = await _client.GetAsync(path);
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(2, CountOccurrences(html, ">Testimonials</a>"));
        Assert.Contains("href=\"/testimonials\">Testimonials</a>", html);
    }

    [Fact]
    public async Task HomePage_RendersTestimonialsSectionAndViewAllLink()
    {
        var response = await _client.GetAsync("/");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("class=\"home-testimonials\"", html);
        Assert.Contains("What Clients Say", html);
        Assert.Contains("href=\"/testimonials\"", html);
        Assert.DoesNotContain("Replace this inactive example", html);
    }

    private static int CountOccurrences(string value, string searchValue) =>
        value.Split(searchValue, StringSplitOptions.None).Length - 1;
}
