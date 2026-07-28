import { APP_ICONS } from '../../../shared/icons/icons';
import { NavigationItem } from './navitation-item';

export const NAVIGATION: readonly NavigationItem[] = [
  {
    label: 'Dashboard',
    route: '/',
    icon: APP_ICONS.home
  },
  {
    label: 'Products',
    route: '/products',
    icon: APP_ICONS.products
  },
  {
    label: 'Tables',
    route: '/tables',
    icon: APP_ICONS.tables
  },
  {
    label: 'Orders',
    route: '/orders',
    icon: APP_ICONS.orders
  }
] as const;
