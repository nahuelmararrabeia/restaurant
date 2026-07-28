import { TestBed } from '@angular/core/testing';

import { LoadingState } from './loading-state';

describe('LoadingState', () => {
  it('renders the supplied loading message', () => {
    const fixture = TestBed.createComponent(LoadingState);
    fixture.componentRef.setInput('text', 'Loading orders...');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading orders...');
  });
});
