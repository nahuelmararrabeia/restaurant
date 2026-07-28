import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EditTable } from './edit-table';
import { TablesApi } from '../../services/tables-api';

describe('EditTable', () => {
  const table = {
    id: 3,
    number: 3,
    capacity: 4,
    status: 'Available' as const,
    activeOrderId: null,
    positionX: null,
    positionY: null
  };
  const api = { getById: vi.fn(), update: vi.fn() };
  const router = { navigate: vi.fn().mockResolvedValue(true) };

  function configure(id: string | null = '3'): EditTable {
    TestBed.configureTestingModule({
      imports: [EditTable],
      providers: [
        { provide: TablesApi, useValue: api },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(
            id === null ? {} : { id }
          ) } }
        }
      ]
    });
    return TestBed.createComponent(EditTable).componentInstance;
  }

  beforeEach(() => vi.clearAllMocks());

  it('loads the table from the route id', () => {
    api.getById.mockReturnValue(of(table));
    const component = configure();
    component.ngOnInit();

    expect(api.getById).toHaveBeenCalledWith(3);
    expect(component.table()).toEqual(table);
    expect(component.loading()).toBe(false);
  });

  it('rejects an invalid route id without calling the API', () => {
    const component = configure('invalid');
    component.ngOnInit();

    expect(api.getById).not.toHaveBeenCalled();
    expect(component.loadError()).toBe('The table ID is invalid.');
  });

  it('updates the loaded table and navigates', () => {
    api.getById.mockReturnValue(of(table));
    api.update.mockReturnValue(of(table));
    const component = configure();
    component.ngOnInit();

    component.updateTable({ number: 5, capacity: 8 });

    expect(api.update).toHaveBeenCalledWith(3, {
      number: 5,
      capacity: 8
    });
    expect(router.navigate).toHaveBeenCalledWith(['/tables']);
  });

  it('shows conflict details when an update fails', () => {
    api.getById.mockReturnValue(of(table));
    api.update.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 409,
      error: { detail: "Table '5' already exists." }
    })));
    const component = configure();
    component.ngOnInit();

    component.updateTable({ number: 5, capacity: 8 });

    expect(component.saveError()).toBe("Table '5' already exists.");
  });
});
