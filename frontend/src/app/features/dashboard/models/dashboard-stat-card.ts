import { SafeHtml } from '@angular/platform-browser';

export interface DashboardStatCard {
  title: string;
  value: string | number;
  icon: SafeHtml | string;
  color: 'blue' | 'green' | 'amber' | 'purple';
}