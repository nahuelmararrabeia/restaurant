import { DashboardStatistics } from './dashboard-statistics';
import { DashboardTable } from './dashboard-table';
import { RecentOrder } from './recent-order';

export interface DashboardResponse {
  statistics: DashboardStatistics;
  tables: DashboardTable[];
  recentOrders: RecentOrder[];
}