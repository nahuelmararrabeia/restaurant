export interface NavigationItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
  readonly disabled?: boolean;
  readonly badge?: number;
}