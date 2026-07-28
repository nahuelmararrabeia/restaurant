import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SubsectionHeader } from './subsection-header';

@Component({
  standalone: true,
  imports: [SubsectionHeader],
  template: `
    <subsection-header
      title="Order"
      subtitle="Order details"
      eyebrow="Order #10"
      backButtonText="Back"
      (onBackButtonClick)="back()"
    >
      <span subsectionHeaderActions>Action content</span>
    </subsection-header>
  `
})
class Host {
  readonly back = vi.fn();
}

describe('SubsectionHeader', () => {
  it('renders its content, projection and emits back', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Order #10');
    expect(element.textContent).toContain('Order details');
    expect(element.textContent).toContain('Action content');
    element.querySelector('button')?.click();
    expect(fixture.componentInstance.back).toHaveBeenCalledOnce();
  });
});
