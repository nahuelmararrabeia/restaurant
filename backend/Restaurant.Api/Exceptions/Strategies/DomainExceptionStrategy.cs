using Microsoft.AspNetCore.Mvc;
using Restaurant.Domain.Exceptions;

namespace Restaurant.Api.Exceptions.Strategies
{
    public sealed class DomainExceptionStrategy
    : ExceptionStrategy<DomainException>
    {
        protected override int StatusCode => StatusCodes.Status400BadRequest;

        protected override ProblemDetails CreateProblemDetails(DomainException exception)
        {
            return new ProblemDetails
            {
                Status = StatusCode,
                Title = "Business rule violated",
                Detail = exception.Message
            };
        }
    }
}
