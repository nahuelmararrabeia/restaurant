using Microsoft.AspNetCore.Mvc;

namespace Restaurant.Api.Exceptions;

public abstract class ExceptionStrategy<TException>
    : IExceptionStrategy
    where TException : Exception
{
    public bool CanHandle(Exception exception)
        => exception is TException;

    public async Task HandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        context.Response.StatusCode = StatusCode;

        await context.Response.WriteAsJsonAsync(
            CreateProblemDetails((TException)exception),
            cancellationToken);
    }

    protected abstract int StatusCode { get; }

    protected abstract ProblemDetails CreateProblemDetails(
        TException exception);
}