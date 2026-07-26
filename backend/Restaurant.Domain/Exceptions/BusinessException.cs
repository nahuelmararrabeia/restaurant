namespace Restaurant.Domain.Exceptions;

public sealed class BusinessException : DomainException
{
    public BusinessException(string message) : base(message)
    {
    }
}