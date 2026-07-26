using Microsoft.AspNetCore.Mvc;
using Restaurant.Api.Exceptions;
using Restaurant.Application.Common.Exceptions;

public sealed class ConflictExceptionStrategy
    : ExceptionStrategy<ConflictException>
{
    protected override int StatusCode =>
        StatusCodes.Status409Conflict;

    protected override ProblemDetails CreateProblemDetails(
        ConflictException exception)
    {
        return new ProblemDetails
        {
            Status = StatusCode,
            Title = "Conflict",
            Detail = exception.Message
        };
    }
}