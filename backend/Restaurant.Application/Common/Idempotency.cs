using System.Security.Cryptography;
using System.Text;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Entities;

namespace Restaurant.Application.Common;

public static class Idempotency
{
    public const string CreateOrder = "orders:create";
    public const string AddOrderItem = "orders:add-item";

    public static string NormalizeKey(string? key)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new BusinessException(
                "Idempotency-Key header is required.");
        }

        var normalized = key.Trim();

        if (normalized.Length is < 1 or > 100)
        {
            throw new BusinessException(
                "Idempotency-Key must contain between 1 and 100 characters.");
        }

        return normalized;
    }

    public static string Hash(params object?[] values)
    {
        var payload = string.Join(
            '\u001f',
            values.Select(value => value?.ToString() ?? string.Empty));
        return Convert.ToHexString(
            SHA256.HashData(Encoding.UTF8.GetBytes(payload)));
    }

    public static void EnsureSameRequest(
        IdempotencyRecord record,
        string requestHash)
    {
        if (!string.Equals(
                record.RequestHash,
                requestHash,
                StringComparison.Ordinal))
        {
            throw new ConflictException(
                "The Idempotency-Key was already used with a different request.");
        }
    }
}
