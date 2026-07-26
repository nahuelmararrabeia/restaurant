using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Api.Exceptions;

public sealed class ValidationExceptionStrategy
    : ExceptionStrategy<ValidationException>
{
    protected override int StatusCode =>
        StatusCodes.Status400BadRequest;

    protected override ProblemDetails CreateProblemDetails(
        ValidationException exception)
    {
        return new ValidationProblemDetails(
            exception.Errors
                .GroupBy(x => x.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()))
        {
            Status = StatusCode,
            Title = "Validation failed"
        };
    }
}