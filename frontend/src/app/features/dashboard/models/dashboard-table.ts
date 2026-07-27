export type DashboardTableStatus =
  | 'Available'
  | 'Occupied'
  | 'Reserved'
  | 'Disabled';

export interface DashboardTable {
  id: number;
  number: number;
  capacity: number;
  status: DashboardTableStatus;
}