using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.Common.Exceptions;

namespace Restaurant.Api.Exceptions.Strategies;

public sealed class NotFoundExceptionStrategy
    : ExceptionStrategy<NotFoundException>
{
    protected override int StatusCode =>
        StatusCodes.Status404NotFound;

    protected override ProblemDetails CreateProblemDetails(
        NotFoundException exception)
    {
        return new ProblemDetails
        {
            Status = StatusCode,
            Title = "Resource not found",
            Detail = exception.Message
        };
    }
}