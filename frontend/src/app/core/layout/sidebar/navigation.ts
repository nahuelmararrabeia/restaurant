import { NavigationItem } from "./navitation-item";

export const NAVIGATION: readonly NavigationItem[] = [
  {
    label: 'Dashboard',
    route: '/',
    icon: '🏠'
  },
  {
    label: 'Products',
    route: '/products',
    icon: '🍔'
  },
  {
    label: 'Tables',
    route: '/tables',
    icon: '🪑'
  },
  {
    label: 'Orders',
    route: '/orders',
    icon: '🧾'
  }
] as const;