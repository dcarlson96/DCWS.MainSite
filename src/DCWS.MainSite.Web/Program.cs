var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    if (context.Request.Host.Host.Equals(
        "www.dcwebsystems.com",
        StringComparison.OrdinalIgnoreCase))
    {
        var redirectUrl =
            $"https://dcwebsystems.com{context.Request.PathBase}{context.Request.Path}{context.Request.QueryString}";

        context.Response.Redirect(redirectUrl, permanent: true);
        return;
    }

    await next();
});

app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

public partial class Program
{
}