namespace Restaurant.Domain.Entities.Common
{
    public abstract class AuditableEntity : Entity
    {
        public long Version { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
