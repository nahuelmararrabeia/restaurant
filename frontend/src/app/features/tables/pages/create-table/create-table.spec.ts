import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { CreateTable } from './create-table';
import { TablesApi } from '../../services/tables-api';

describe('CreateTable', () => {
  const api = { create: vi.fn() };
  const router = { navigate: vi.fn().mockResolvedValue(true) };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [CreateTable],
      providers: [
        { provide: TablesApi, useValue: api },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('creates a table and navigates to the list', () => {
    api.create.mockReturnValue(of({}));
    const component = TestBed.createComponent(CreateTable).componentInstance;

    component.createTable({ number: 7, capacity: 4 });

    expect(api.create).toHaveBeenCalledWith({ number: 7, capacity: 4 });
    expect(router.navigate).toHaveBeenCalledWith(['/tables']);
    expect(component.saving()).toBe(false);
  });

  it('shows the API conflict detail', () => {
    api.create.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 409,
      error: { detail: "Table '7' already exists." }
    })));
    const component = TestBed.createComponent(CreateTable).componentInstance;

    component.createTable({ number: 7, capacity: 4 });

    expect(component.error()).toBe("Table '7' already exists.");
  });

  it('prevents duplicate submissions while saving', () => {
    api.create.mockReturnValue(new Subject());
    const component = TestBed.createComponent(CreateTable).componentInstance;

    component.createTable({ number: 7, capacity: 4 });
    component.createTable({ number: 8, capacity: 6 });

    expect(api.create).toHaveBeenCalledOnce();
    expect(component.saving()).toBe(true);
  });
});
