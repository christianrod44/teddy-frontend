import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientsListComponent } from './clients-list.component';
import { ClientService } from '../services/client.service';
import { Router, provideRouter, ActivatedRoute, UrlTree } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Client } from '../models/client.model';
import { ClientApiResponse } from '../models/client-api-response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ClientCardComponent } from '../client-card/client-card.component';
import { ClientFormComponent } from '../client-form/client-form.component';
import { DeleteClientModalComponent } from '../delete-client-modal/delete-client-modal.component';
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';

class MockClientService {
  getClients = jasmine.createSpy('getClients').and.returnValue(of({
    clients: [],
    totalClientsFound: 0,
    totalPages: 1
  }));
  createClient = jasmine.createSpy('createClient').and.returnValue(of({}));
  updateClient = jasmine.createSpy('updateClient').and.returnValue(of({}));
  deleteClient = jasmine.createSpy('deleteClient').and.returnValue(of('Deletion successful'));
}

class MockRouter {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
  navigate = jasmine.createSpy('navigate');
  url = '/clients-list';
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


describe('ClientsListComponent', () => {
  let component: ClientsListComponent;
  let fixture: ComponentFixture<ClientsListComponent>;
  let mockClientService: MockClientService;
  let mockRouter: MockRouter;
  let mockActivatedRoute: MockActivatedRoute;
  let alertSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;
  let localStorageSetItemSpy: jasmine.Spy;
  let localStorageGetItemSpy: jasmine.Spy;

  const mockClients: Client[] = [
    { id: 1, name: 'Client A', salary: 1000, companyValuation: 5000, selected: false },
    { id: 2, name: 'Client B', salary: 2000, companyValuation: 10000, selected: false },
    { id: 3, name: 'Client C', salary: 3000, companyValuation: 15000, selected: false }
  ];

  beforeEach(async () => {
    mockClientService = new MockClientService();
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    alertSpy = spyOn(window, 'alert');
    consoleErrorSpy = spyOn(console, 'error');
    localStorageSetItemSpy = spyOn(localStorage, 'setItem');
    localStorageGetItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [
        ClientsListComponent,
        CommonModule,
        FormsModule,
        HeaderComponent,
        SidebarComponent,
        ClientCardComponent,
        ClientFormComponent,
        DeleteClientModalComponent
      ],
      providers: [
        provideRouter([
          { path: '', component: ClientsListComponent },
          { path: 'clients', component: ClientsListComponent },
          { path: 'clients-selected', component: ClientsListComponent }
        ]),
        provideHttpClientTesting(),
        { provide: ClientService, useValue: mockClientService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set default user name if not found in localStorage', () => {
    localStorageGetItemSpy.and.returnValue(null);
    component.ngOnInit();
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

  it('should load clients on ngOnInit', fakeAsync(() => {
    const mockApiResponse: ClientApiResponse = {
      clients: mockClients,
      totalPages: 1
    };
    mockClientService.getClients.and.returnValue(of(mockApiResponse));
  
    localStorageGetItemSpy.withArgs('selectedClients').and.returnValue(JSON.stringify([]));

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(mockClientService.getClients).toHaveBeenCalledWith(1, 16);
    expect(component.clients).toEqual(mockClients);
    expect(component.totalClientsFound).toBe(mockClients.length);
    expect(component.totalPages).toBe(1);
    expect(component.selectedClients).toEqual([]);
  }));

  it('should handle error when loading clients', fakeAsync(() => {
    const errorMessage = 'API Error';
    mockClientService.getClients.and.returnValue(throwError(() => new Error(errorMessage)));

    component.loadClients();
    tick();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao carregar clientes:', jasmine.any(Error));
    expect(alertSpy).toHaveBeenCalledWith('Ocorreu um erro ao carregar os clientes. Verifique o console para mais detalhes.');
    expect(component.clients).toEqual([]);
    expect(component.totalClientsFound).toBe(0);
    expect(component.totalPages).toBe(1);
  }));

  it('should load selected clients from localStorage', () => {
    localStorageGetItemSpy.and.returnValue(JSON.stringify(mockClients.slice(0, 1)));
    component.loadSelectedClientsFromStorage();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('selectedClients');
    expect(component.selectedClients).toEqual(mockClients.slice(0, 1));
  });

  it('should save selected clients to localStorage', () => {
    component.selectedClients = mockClients.slice(0, 2); 
    component.saveSelectedClientsToStorage();
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('selectedClients', JSON.stringify(mockClients.slice(0, 2)));
  });

  it('should sync selected clients state with current clients list', () => {
    component.selectedClients = [{ ...mockClients[0], selected: true }];
    component.clients = [...mockClients]; 

    component.syncSelectedClients();

    expect(component.clients[0].selected).toBeTrue();
    expect(component.clients[1].selected).toBeFalse();
    expect(component.clients[2].selected).toBeFalse();
  });

  it('should toggle selection for a client (add to selected)', () => {
    component.clients = [...mockClients];
    component.selectedClients = [];
    spyOn(component, 'saveSelectedClientsToStorage');

    component.onToggleClientSelection(component.clients[0]);

    expect(component.selectedClients.length).toBe(1);
    expect(component.selectedClients[0]).toEqual(jasmine.objectContaining({ id: 1, selected: true }));
    expect(component.clients[0].selected).toBeTrue();
    expect(component.saveSelectedClientsToStorage).toHaveBeenCalled();
  });

  it('should toggle selection for a client (remove from selected)', () => {
    component.clients = [...mockClients];
    component.selectedClients = [{ ...mockClients[0], selected: true }];
    spyOn(component, 'saveSelectedClientsToStorage');

    component.onToggleClientSelection(component.clients[0]);

    expect(component.selectedClients.length).toBe(0);
    expect(component.clients[0].selected).toBeFalse();
    expect(component.saveSelectedClientsToStorage).toHaveBeenCalled();
  });

  it('should handle toggleSelection event from ClientCardComponent', fakeAsync(() => {
    const mockApiResponse: ClientApiResponse = {
      clients: [mockClients[0]],
      totalPages: 1
    };
    mockClientService.getClients.and.returnValue(of(mockApiResponse));

    fixture.detectChanges(); 
    tick();
    fixture.detectChanges(); 

    spyOn(component, 'onToggleClientSelection'); 

    const clientCardDebugElement = fixture.debugElement.query(By.directive(ClientCardComponent));
    clientCardDebugElement.triggerEventHandler('toggleSelection', mockClients[0]);

    expect(component.onToggleClientSelection).toHaveBeenCalledWith(mockClients[0]);
  }));

  it('should reset current page and load clients on clients per page change', () => {
    spyOn(component, 'loadClients');
    component.currentPage = 2; 
    component.clientsPerPage = 10;

    component.onClientsPerPageChange();

    expect(component.currentPage).toBe(0);
    expect(component.clientsPerPage).toBe(10);
    expect(component.loadClients).toHaveBeenCalled();
  });

  it('should change page and load clients', () => {
    spyOn(component, 'loadClients');
    component.totalPages = 5;

    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(component.loadClients).toHaveBeenCalled();
  });

  it('should not change page if new page is out of bounds', () => {
    spyOn(component, 'loadClients');
    component.totalPages = 5;

    component.onPageChange(-1);
    expect(component.currentPage).toBe(0);
    expect(component.loadClients).not.toHaveBeenCalled();

    component.onPageChange(5);
    expect(component.currentPage).toBe(0);
    expect(component.loadClients).not.toHaveBeenCalled();
  });

  it('should open client form modal in create mode on onCreateClient', () => {
    component.selectedClientForEdit = mockClients[0];
    component.isClientFormModalOpen = false;

    component.onCreateClient();

    expect(component.selectedClientForEdit).toBeUndefined();
    expect(component.isClientFormModalOpen).toBeTrue();
  });

  it('should open client form modal in edit mode on onEditClient if client is not selected', () => {
    const clientToEdit: Client = { id: 1, name: 'Edit Me', salary: 100, companyValuation: 500, selected: false };
    component.isClientFormModalOpen = false;
    component.selectedClientForEdit = undefined;

    component.onEditClient(clientToEdit);

    expect(component.isClientFormModalOpen).toBeTrue();

    expect(component.selectedClientForEdit).toEqual(jasmine.objectContaining(clientToEdit));
  });

  it('should not open client form modal in edit mode if client is selected', () => {
    const clientToEdit: Client = { id: 1, name: 'Edit Me', salary: 100, companyValuation: 500, selected: true };
    component.isClientFormModalOpen = false;
    component.selectedClientForEdit = undefined;

    component.onEditClient(clientToEdit);

    expect(component.isClientFormModalOpen).toBeFalse();
    expect(component.selectedClientForEdit).toBeUndefined();
  });

  it('should close client form modal and reload clients on onClientFormClose', () => {
    spyOn(component, 'loadClients');
    component.isClientFormModalOpen = true;
    component.selectedClientForEdit = mockClients[0];

    component.onClientFormClose();

    expect(component.isClientFormModalOpen).toBeFalse();
    expect(component.selectedClientForEdit).toBeUndefined();
    expect(component.loadClients).toHaveBeenCalled();
  });

  it('should show alert, reload clients and close form on onClientCreated', () => {
    spyOn(component, 'loadClients');
    spyOn(component, 'onClientFormClose');
    const newClient: Client = { id: 4, name: 'New Client', salary: 123, companyValuation: 456, selected: false };

    component.onClientCreated(newClient);

    expect(alertSpy).toHaveBeenCalledWith(`Cliente '${newClient.name}' criado com sucesso!`);
    expect(component.loadClients).toHaveBeenCalled();
    expect(component.onClientFormClose).toHaveBeenCalled();
  });

  it('should show alert, reload clients and close form on onClientUpdated', () => {
    spyOn(component, 'loadClients');
    spyOn(component, 'onClientFormClose');
    const updatedClient: Client = { id: 1, name: 'Updated Client', salary: 123, companyValuation: 456, selected: false };

    component.onClientUpdated(updatedClient);

    expect(alertSpy).toHaveBeenCalledWith(`Cliente '${updatedClient.name}' atualizado com sucesso!`);
    expect(component.loadClients).toHaveBeenCalled();
    expect(component.onClientFormClose).toHaveBeenCalled();
  });

  it('should open delete client modal on onDeleteClient if client is not selected', () => {
    const clientToDelete: Client = { id: 1, name: 'Delete Me', salary: 100, companyValuation: 500, selected: false };
    component.isDeleteClientModalOpen = false;
    component.clientToDelete = undefined;

    component.onDeleteClient(clientToDelete);

    expect(component.isDeleteClientModalOpen).toBeTrue();
    expect(component.clientToDelete).toEqual(jasmine.objectContaining(clientToDelete));
  });

  it('should not open delete client modal if client is selected', () => {
    const clientToDelete: Client = { id: 1, name: 'Delete Me', salary: 100, companyValuation: 500, selected: true };
    component.isDeleteClientModalOpen = false;
    component.clientToDelete = undefined;

    component.onDeleteClient(clientToDelete);

    expect(component.isDeleteClientModalOpen).toBeFalse();
    expect(component.clientToDelete).toBeUndefined();
  });

  it('should confirm delete and reload clients on onConfirmDelete success', fakeAsync(() => {
    const clientIdToDelete = 1;
    mockClientService.deleteClient.and.returnValue(of('Deletion successful'));

    spyOn(component, 'onCloseDeleteModal');
    spyOn(component, 'loadClients');
    spyOn(component, 'saveSelectedClientsToStorage');

    component.selectedClients = [{ ...mockClients[0], id: clientIdToDelete, selected: true }];

    component.onConfirmDelete(clientIdToDelete);
    tick();

    expect(mockClientService.deleteClient).toHaveBeenCalledWith(clientIdToDelete);
    expect(alertSpy).toHaveBeenCalledWith('Cliente excluído com sucesso!');
    expect(component.onCloseDeleteModal).toHaveBeenCalled();
    expect(component.selectedClients).toEqual([]);
    expect(component.saveSelectedClientsToStorage).toHaveBeenCalled();
    expect(component.loadClients).toHaveBeenCalled();
  }));

  it('should handle error on onConfirmDelete', fakeAsync(() => {
    const clientIdToDelete = 1;
    const errorMessage = 'Delete failed';
    mockClientService.deleteClient.and.returnValue(throwError(() => new Error(errorMessage)));

    spyOn(component, 'onCloseDeleteModal');
    spyOn(component, 'loadClients');
    spyOn(component, 'saveSelectedClientsToStorage');

    component.onConfirmDelete(clientIdToDelete);
    tick();

    expect(mockClientService.deleteClient).toHaveBeenCalledWith(clientIdToDelete);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao excluir cliente:', jasmine.any(Error));
    expect(alertSpy).toHaveBeenCalledWith('Houve um problema ao processar a resposta da exclusão, mas o cliente pode ter sido removido. Por favor, recarregue a página se a lista não atualizar.');
    expect(component.onCloseDeleteModal).toHaveBeenCalled();
    expect(component.saveSelectedClientsToStorage).not.toHaveBeenCalled();
    expect(component.loadClients).toHaveBeenCalled();
  }));


  it('should close delete modal on onCloseDeleteModal', () => {
    component.isDeleteClientModalOpen = true;
    component.clientToDelete = mockClients[0];

    component.onCloseDeleteModal();

    expect(component.isDeleteClientModalOpen).toBeFalse();
    expect(component.clientToDelete).toBeUndefined();
  });

  it('should navigate to clients-selected page with selectedClients state', () => {
    component.selectedClients = mockClients.filter(c => c.id === 1);
    component.goToSelectedClients();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/clients-selected', { state: { selectedClients: component.selectedClients } });
  });
});