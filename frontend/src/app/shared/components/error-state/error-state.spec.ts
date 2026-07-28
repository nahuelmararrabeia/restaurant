import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

import { ErrorState } from './error-state';

describe('ErrorState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideIcons({ heroXMark })]
    });
  });

  it('renders text and emits the text button action', () => {
    const fixture = TestBed.createComponent(ErrorState);
    fixture.componentRef.setInput('text', 'Could not load data.');
    fixture.componentRef.setInput('buttonText', 'Retry');
    fixture.detectChanges();
    const click = vi.fn();
    fixture.componentInstance.onClickButton.subscribe(click);

    fixture.nativeElement.querySelector('button').click();

    expect(fixture.nativeElement.textContent).toContain('Could not load data.');
    expect(fixture.nativeElement.textContent).toContain('Retry');
    expect(click).toHaveBeenCalledOnce();
  });

  it('renders an icon-only accessible close button', () => {
    const fixture = TestBed.createComponent(ErrorState);
    fixture.componentRef.setInput('text', 'Error');
    fixture.componentRef.setInput('buttonIcon', 'heroXMark');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Close');
    expect(button.querySelector('ng-icon')).not.toBeNull();
  });

  it('does not render a button without an action label or icon', () => {
    const fixture = TestBed.createComponent(ErrorState);
    fixture.componentRef.setInput('text', 'Error');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});
