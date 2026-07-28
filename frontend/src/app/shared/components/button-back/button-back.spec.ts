import { TestBed } from '@angular/core/testing';

import { ButtonBack } from './button-back';

describe('ButtonBack', () => {
  it('renders its text and emits click events', () => {
    const fixture = TestBed.createComponent(ButtonBack);
    fixture.componentRef.setInput('text', 'Back to orders');
    fixture.detectChanges();
    const onClick = vi.fn();
    fixture.componentInstance.onClick.subscribe(onClick);

    fixture.nativeElement.querySelector('button').click();

    expect(fixture.nativeElement.textContent).toContain('Back to orders');
    expect(onClick).toHaveBeenCalledOnce();
  });
});
