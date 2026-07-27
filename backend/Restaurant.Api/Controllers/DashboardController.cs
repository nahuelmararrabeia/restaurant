using MediatR;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.Dashboard.Queries.GetDashboard;
using Restaurant.Application.Dashboard.Responses;

namespace Restaurant.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class DashboardController : ControllerBase
{
    private readonly ISender _sender;

    public DashboardController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(DashboardResponse),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<DashboardResponse>> Get(
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(
            new GetDashboardQuery(),
            cancellationToken);

        return Ok(response);
    }
}