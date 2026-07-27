using MediatR;
using Restaurant.Application.Dashboard.Responses;

namespace Restaurant.Application.Dashboard.Queries.GetDashboard;

public sealed record GetDashboardQuery
    : IRequest<DashboardResponse>;