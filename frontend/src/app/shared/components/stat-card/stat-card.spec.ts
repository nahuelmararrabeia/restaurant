import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { heroShoppingBag } from '@ng-icons/heroicons/outline';

import { StatCard } from './stat-card';

describe('StatCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideIcons({ heroShoppingBag })]
    });
  });

  it.each([
    ['blue', 'bg-blue-100'],
    ['green', 'bg-green-100'],
    ['amber', 'bg-amber-100'],
    ['red', 'bg-red-100'],
    ['purple', 'bg-purple-100']
  ])('renders the %s color variant', (color, cssClass) => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('title', 'Products');
    fixture.componentRef.setInput('value', 12);
    fixture.componentRef.setInput('icon', 'heroShoppingBag');
    fixture.componentRef.setInput('color', color);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Products');
    expect(element.textContent).toContain('12');
    expect(element.querySelector(`.${cssClass}`)).not.toBeNull();
  });
});
