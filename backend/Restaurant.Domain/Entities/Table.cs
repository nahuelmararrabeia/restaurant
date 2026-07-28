using Restaurant.Domain.Entities.Common;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Exceptions;

namespace Restaurant.Domain.Entities
{
    public class Table : AuditableEntity
    {
        public int Number { get; private set; }

        public int Capacity { get; private set; }

        public TableStatus Status { get; private set; }

        public double? PositionX { get; private set; }

        public double? PositionY { get; private set; }

        public ICollection<Order> Orders { get; private set; } = new List<Order>();

        private Table() { }

        public Table(int number, int capacity)
        {
            Number = number;
            Capacity = capacity;
            Status = TableStatus.Available;
        }

        public void Update(int number, int capacity)
        {
            Number = number;
            Capacity = capacity;
        }

        public void SetPosition(double positionX, double positionY)
        {
            if (
                positionX is < 0 or > 100 ||
                positionY is < 0 or > 100)
            {
                throw new BusinessException(
                    "Table position must be between 0 and 100.");
            }

            PositionX = positionX;
            PositionY = positionY;
        }

        public void Enable()
        {
            if (Status != TableStatus.Disabled)
                return;

            Status = TableStatus.Available;
        }

        public void Disable()
        {
            if (Status == TableStatus.Occupied)
                throw new BusinessException("An occupied table cannot be disabled.");

            Status = TableStatus.Disabled;
        }

        public void Occupy()
        {
            if (Status != TableStatus.Available &&
                Status != TableStatus.Reserved)
            {
                throw new BusinessException("Table cannot be occupied.");
            }

            Status = TableStatus.Occupied;
        }

        public void Release()
        {
            if (Status != TableStatus.Occupied)
                throw new BusinessException("Table is not occupied.");

            Status = TableStatus.Available;
        }

        public void Reserve()
        {
            if (Status != TableStatus.Available)
                throw new BusinessException("Table is not available.");

            Status = TableStatus.Reserved;
        }

        public void CancelReservation()
        {
            if (Status != TableStatus.Reserved)
                throw new BusinessException("Table is not reserved.");

            Status = TableStatus.Available;
        }
    }
}
