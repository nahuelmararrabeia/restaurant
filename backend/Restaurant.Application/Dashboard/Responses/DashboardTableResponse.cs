using Restaurant.Domain.Enums;

namespace Restaurant.Application.Dashboard.Responses
{
    public sealed record DashboardTableResponse(
    int Id,
    int Number,
    int Capacity,
    TableStatus Status);
}
