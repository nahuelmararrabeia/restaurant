import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonBack } from '../button-back/button-back';

@Component({
  selector: 'subsection-header',
  standalone: true,
  imports: [ButtonBack],
  templateUrl: './subsection-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubsectionHeader {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly eyebrow = input<string>();
  readonly backButtonText = input<string>();
  readonly onBackButtonClick = output<void>();
}
