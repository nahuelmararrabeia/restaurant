import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'empty-state',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly buttonText = input<string>();
  readonly buttonLink = input<any[]>();
}
