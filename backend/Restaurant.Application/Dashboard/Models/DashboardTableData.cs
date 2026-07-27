using Restaurant.Domain.Enums;

namespace Restaurant.Application.Dashboard.Models
{
    public sealed record DashboardTableData(
    int Id,
    int Number,
    int Capacity,
    TableStatus Status);
}
