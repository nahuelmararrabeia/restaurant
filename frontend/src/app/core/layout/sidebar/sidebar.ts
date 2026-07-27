import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAVIGATION } from './navigation';

@Component({
  selector: 'app-sidebar',
  standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  readonly close = output<void>();
  protected readonly navigation = NAVIGATION;
}
