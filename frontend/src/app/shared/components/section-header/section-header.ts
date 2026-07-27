import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './section-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly actionText = input<string>();
  readonly actionLink = input<readonly any[]>();
}
