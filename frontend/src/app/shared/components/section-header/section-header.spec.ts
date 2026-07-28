import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SectionHeader } from './section-header';

describe('SectionHeader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('renders title, subtitle and action link', () => {
    const fixture = TestBed.createComponent(SectionHeader);
    fixture.componentRef.setInput('title', 'Products');
    fixture.componentRef.setInput('subtitle', 'Manage products');
    fixture.componentRef.setInput('actionText', 'Add product');
    fixture.componentRef.setInput('actionLink', ['/products', 'new']);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Products');
    expect(element.querySelector('p')?.textContent).toContain('Manage products');
    expect(element.querySelector('a')?.textContent).toContain('Add product');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/products/new');
  });

  it('omits optional content when it is not supplied', () => {
    const fixture = TestBed.createComponent(SectionHeader);
    fixture.componentRef.setInput('title', 'Orders');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p')).toBeNull();
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });
});
