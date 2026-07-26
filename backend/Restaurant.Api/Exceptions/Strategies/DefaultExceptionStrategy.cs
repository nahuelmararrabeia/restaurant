using Microsoft.AspNetCore.Mvc;
using Restaurant.Api.Exceptions;

public sealed class DefaultExceptionStrategy
    : ExceptionStrategy<Exception>
{
    protected override int StatusCode =>
        StatusCodes.Status500InternalServerError;

    protected override ProblemDetails CreateProblemDetails(
        Exception exception)
    {
        return new ProblemDetails
        {
            Status = StatusCode,
            Title = "Internal Server Error",
            Detail = "An unexpected error occurred."
        };
    }
}