import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../icons/icon.type';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'stat-card',
  standalone: true,
  imports: [NgClass, NgIcon ],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCard {
  readonly title = input.required<string>();

  readonly value = input.required<string | number>();

  readonly icon = input<AppIcon>();

  readonly color = input<string | undefined>('blue');
}
