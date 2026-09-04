using DCWS.MainSite.Web.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging.Abstractions;

namespace DCWS.MainSite.Web.Tests;

public sealed class TestimonialServiceTests : IDisposable
{
    private readonly string _contentRoot = Path.Combine(
        Path.GetTempPath(),
        $"dcws-testimonials-{Guid.NewGuid():N}");

    [Fact]
    public async Task GetPublishedAsync_ReturnsOnlyActiveTestimonials_InDisplayOrder()
    {
        var dataDirectory = Path.Combine(_contentRoot, "Data");
        Directory.CreateDirectory(dataDirectory);
        await File.WriteAllTextAsync(
            Path.Combine(dataDirectory, "testimonials.json"),
            """
            [
              { "name": "Second", "review": "Review 2", "displayOrder": 20, "isActive": true },
              { "name": "Hidden", "review": "Review 3", "displayOrder": 1, "isActive": false },
              { "name": "First", "review": "Review 1", "displayOrder": 10, "isActive": true }
            ]
            """);
        var service = new TestimonialService(
            new TestWebHostEnvironment(_contentRoot),
            NullLogger<TestimonialService>.Instance);

        var result = await service.GetPublishedAsync();

        Assert.Collection(
            result,
            testimonial => Assert.Equal("First", testimonial.Name),
            testimonial => Assert.Equal("Second", testimonial.Name));
        Assert.DoesNotContain(result, testimonial => testimonial.Name == "Hidden");
    }

    public void Dispose()
    {
        if (Directory.Exists(_contentRoot))
        {
            Directory.Delete(_contentRoot, recursive: true);
        }
    }

    private sealed class TestWebHostEnvironment(string contentRootPath) : IWebHostEnvironment
    {
        public string ApplicationName { get; set; } = "DCWS.MainSite.Web.Tests";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
        public string ContentRootPath { get; set; } = contentRootPath;
        public string EnvironmentName { get; set; } = "Test";
        public string WebRootPath { get; set; } = contentRootPath;
        public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
    }
}
