import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientsSelectedComponent } from './clients-selected.component';
import { Router, provideRouter, ActivatedRoute, UrlTree } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Client } from '../models/client.model';
import { of } from 'rxjs';

class MockRouter {
  private _currentNavigation: any | null = null;

  getCurrentNavigation(): any | null {
    return this._currentNavigation;
  }

  setCurrentNavigation(state: any): void {
    this._currentNavigation = { extras: { state } };
  }

  navigateByUrl = jasmine.createSpy('navigateByUrl');
  navigate = jasmine.createSpy('navigate');
  url = '/clients-selected';
  events = of();

  createUrlTree(commands: any[], navigationExtras?: any): UrlTree {
    return {
      toString: () => `/${commands.join('/')}`,
      queryParams: navigationExtras?.queryParams || null,
      fragment: navigationExtras?.fragment || null,
      root: {} as any
    } as UrlTree;
  }
  serializeUrl(url: UrlTree): string {
    return url.toString();
  }
}

class MockActivatedRoute {
  paramMap = of({});
  queryParamMap = of({});
  fragment = of(null);
  data = of({});
  snapshot = {
    paramMap: { get: (key: string) => null },
    queryParamMap: { get: (key: string) => null },
    data: {},
    url: []
  };
}

describe('ClientsSelectedComponent', () => {
  let component: ClientsSelectedComponent;
  let fixture: ComponentFixture<ClientsSelectedComponent>;
  let mockRouter: MockRouter;
  let alertSpy: jasmine.Spy;
  let confirmSpy: jasmine.Spy;
  let localStorageSetItemSpy: jasmine.Spy;
  let localStorageGetItemSpy: jasmine.Spy;

  const mockClients: Client[] = [
    { id: 1, name: 'Client A', salary: 1000, companyValuation: 5000, selected: true },
    { id: 2, name: 'Client B', salary: 2000, companyValuation: 10000, selected: true }
  ];

  beforeEach(async () => {
    mockRouter = new MockRouter();

    alertSpy = spyOn(window, 'alert');
    confirmSpy = spyOn(window, 'confirm');

    localStorageSetItemSpy = spyOn(localStorage, 'setItem');
    localStorageGetItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [
        ClientsSelectedComponent,
        CommonModule,
        CurrencyPipe,
        HeaderComponent,
        SidebarComponent
      ],
      providers: [
        provideRouter([
          { path: 'clients-selected', component: ClientsSelectedComponent }
        ]),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsSelectedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load selected clients from localStorage if no navigation state', () => {
    mockRouter.setCurrentNavigation(null);
    localStorageGetItemSpy.and.returnValue(JSON.stringify(mockClients.slice(0, 1)));

    fixture = TestBed.createComponent(ClientsSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.selectedClients).toEqual(mockClients.slice(0, 1));
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('selectedClients');
  });

  it('should load user name from localStorage on ngOnInit', () => {
    localStorageGetItemSpy.withArgs('userName').and.returnValue('TestUser');
    fixture.detectChanges();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('userName');
    expect(component.userNameFromStorage).toBe('TestUser');
  });

  it('should set default user name if not found in localStorage', () => {
    localStorageGetItemSpy.withArgs('userName').and.returnValue(null);
    fixture.detectChanges();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('userName');
    expect(component.userNameFromStorage).toBe('Usuário!');
  });

  it('should toggle sidebar state', () => {
    component.isSidebarOpen = false;
    component.toggleSidebarState();
    expect(component.isSidebarOpen).toBeTrue();
    component.toggleSidebarState();
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should remove a client from selectedClients and update storage', () => {
    component.selectedClients = [...mockClients];
    const clientToRemove = mockClients[0];

    component.onRemoveSelection(clientToRemove);

    expect(component.selectedClients).not.toContain(clientToRemove);
    expect(component.selectedClients.length).toBe(1);
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('selectedClients', JSON.stringify([mockClients[1]]));
  });

  it('should clear all selected clients and update storage if confirmed', () => {
    component.selectedClients = [...mockClients];
    confirmSpy.and.returnValue(true);

    component.onClearSelectedClients();

    expect(confirmSpy).toHaveBeenCalledWith('Tem certeza que deseja remover todos os clientes selecionados?');
    expect(component.selectedClients).toEqual([]);
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('selectedClients', JSON.stringify([]));
    expect(alertSpy).toHaveBeenCalledWith('Todos os clientes selecionados foram removidos.');
  });

  it('should not clear selected clients if not confirmed', () => {
    component.selectedClients = [...mockClients];
    confirmSpy.and.returnValue(false);

    component.onClearSelectedClients();

    expect(confirmSpy).toHaveBeenCalledWith('Tem certeza que deseja remover todos os clientes selecionados?');
    expect(component.selectedClients).toEqual(mockClients);
    expect(localStorageSetItemSpy).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
  });
});