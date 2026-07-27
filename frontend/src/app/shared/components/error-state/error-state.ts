import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'error-state',
  standalone: true,
  imports: [],
  templateUrl: './error-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorState {
  readonly text = input.required<string | null>();
  readonly buttonText = input<string>();
  readonly onClickButton = output<void>();
}
