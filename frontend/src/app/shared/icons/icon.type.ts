import { APP_ICONS } from './icons';

export type AppIcon =
  (typeof APP_ICONS)[keyof typeof APP_ICONS];