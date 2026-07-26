using Restaurant.Api.Exceptions;
using Restaurant.Api.Exceptions.Strategies;

namespace Restaurant.Api;

public static class DependencyInjection
{
    public static IServiceCollection AddApi(this IServiceCollection services)
    {
        services.AddProblemDetails();

        services.AddExceptionHandler<GlobalExceptionHandler>();

        var assembly = typeof(GlobalExceptionHandler).Assembly;

        var exceptionStrategyTypes = assembly.GetTypes()
            .Where(t =>
                !t.IsAbstract &&
                !t.IsInterface &&
                typeof(IExceptionStrategy).IsAssignableFrom(t));

        foreach (var strategyType in exceptionStrategyTypes)
        {
            services.AddSingleton(typeof(IExceptionStrategy), strategyType);
        }

        services.AddSingleton<ExceptionStrategyResolver>();

        services.AddControllers();

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddOpenApi();

        services.AddHealthChecks();

        return services;
    }
}