export type DashboardTableStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'disabled';

export interface DashboardTable {
  id: number;
  number: number;
  capacity: number;
  status: DashboardTableStatus;
}