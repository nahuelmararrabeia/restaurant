import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'error-state',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './error-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorState {
  readonly text = input.required<string | null>();
  readonly buttonText = input<string>();
  readonly buttonIcon = input<string>();
  readonly onClickButton = output<void>();
}
