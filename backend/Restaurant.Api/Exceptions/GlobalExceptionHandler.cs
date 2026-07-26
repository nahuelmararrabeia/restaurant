using Microsoft.AspNetCore.Diagnostics;

namespace Restaurant.Api.Exceptions;

public sealed class GlobalExceptionHandler
    : IExceptionHandler
{
    private readonly ExceptionStrategyResolver _resolver;

    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(
        ExceptionStrategyResolver resolver,
        ILogger<GlobalExceptionHandler> logger)
    {
        _resolver = resolver;
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(
            exception,
            exception.Message);

        var strategy = _resolver.Resolve(exception);

        await strategy.HandleAsync(
            context,
            exception,
            cancellationToken);

        return true;
    }
}