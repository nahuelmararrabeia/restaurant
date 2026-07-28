import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { heroCake } from '@ng-icons/heroicons/outline';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideIcons({ heroCake })
      ]
    });
  });

  it('renders all optional content and its link', () => {
    const fixture = TestBed.createComponent(EmptyState);
    fixture.componentRef.setInput('title', 'No products');
    fixture.componentRef.setInput('subtitle', 'Create the first product.');
    fixture.componentRef.setInput('icon', 'heroCake');
    fixture.componentRef.setInput('buttonText', 'Create product');
    fixture.componentRef.setInput('buttonLink', ['/products', 'new']);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('No products');
    expect(element.textContent).toContain('Create the first product.');
    expect(element.querySelector('ng-icon')).not.toBeNull();
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/products/new');
  });

  it('applies the compact variant without optional content', () => {
    const fixture = TestBed.createComponent(EmptyState);
    fixture.componentRef.setInput('title', 'Empty');
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();
    const container = fixture.nativeElement.firstElementChild as HTMLElement;
    expect(container.classList.contains('py-14')).toBe(true);
    expect(container.classList.contains('border')).toBe(false);
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });
});
