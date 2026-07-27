import { Component, input, output } from '@angular/core';

@Component({
  selector: 'button-back',
  imports: [],
  templateUrl: './button-back.html',
})
export class ButtonBack {
  readonly text = input<string>();
  readonly onClick = output<void>();
}
