using Restaurant.Api.Exceptions;

public sealed class ExceptionStrategyResolver
{
    private readonly IReadOnlyList<IExceptionStrategy> _strategies;
    private readonly IExceptionStrategy _defaultStrategy;

    public ExceptionStrategyResolver(IEnumerable<IExceptionStrategy> strategies)
    {
        var list = strategies.ToList();

        _defaultStrategy = list.OfType<DefaultExceptionStrategy>().Single();

        _strategies = list
            .Where(s => s is not DefaultExceptionStrategy)
            .ToList();
    }

    public IExceptionStrategy Resolve(Exception exception)
    {
        return _strategies.FirstOrDefault(s => s.CanHandle(exception))
               ?? _defaultStrategy;
    }
}