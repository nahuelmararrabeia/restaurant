namespace Restaurant.Api.Exceptions;

public interface IExceptionStrategy
{
    bool CanHandle(Exception exception);

    Task HandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken);
}