import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'loading-state',
  standalone: true,
  imports: [],
  templateUrl: './loading-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingState {
  readonly text = input.required<string>();
}
