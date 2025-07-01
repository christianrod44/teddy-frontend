import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientFormComponent } from './client-form.component';
import { ClientService } from '../services/client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { of, throwError } from 'rxjs';
import { Client } from '../models/client.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('ClientFormComponent', () => {
  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;
  let mockClientService: any;
  let alertSpy: jasmine.Spy;

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', ['createClient', 'updateClient']);
    mockClientService.createClient.and.returnValue(of({ id: 1, name: 'New Client', salary: 1000, companyValuation: 5000 }));
    mockClientService.updateClient.and.returnValue(of({ id: 1, name: 'Updated Client', salary: 1200, companyValuation: 6000 }));

    alertSpy = spyOn(window, 'alert');

    await TestBed.configureTestingModule({
      imports: [
        ClientFormComponent,
        CommonModule,
        FormsModule,
        NgxMaskDirective
      ],
      providers: [
        { provide: ClientService, useValue: mockClientService },
        provideNgxMask()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode by default', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.client.name).toBe('');
    expect(component.client.salary).toBe(0);
    expect(component.client.companyValuation).toBe(0);
  });

  it('should open in edit mode when clientToEdit is provided and isOpen is true', () => {
    const client: Client = { id: 1, name: 'Test Client', salary: 100, companyValuation: 1000, selected: false };
    component.clientToEdit = client;
    component.isOpen = true;

    component.ngOnChanges({
      isOpen: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      },
      clientToEdit: {
        currentValue: client,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    fixture.detectChanges();

    expect(component.isEditMode).toBeTrue();
    expect(component.client.name).toBe(client.name);
    expect(component.client.salary).toBe(client.salary);
    expect(component.client.companyValuation).toBe(client.companyValuation);
  });

  it('should reset form when clientToEdit is not provided and isOpen is true (create mode)', () => {
    component.clientToEdit = undefined; 
    component.isOpen = true; 

    component.isEditMode = true;
    component.client.name = 'Old Name';

    component.ngOnChanges({
      isOpen: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      },
      clientToEdit: {
        currentValue: undefined,
        previousValue: { id: 1, name: 'Old Client', salary: 100, companyValuation: 1000 },
        firstChange: false,
        isFirstChange: () => false
      }
    });
    fixture.detectChanges();

    expect(component.isEditMode).toBeFalse();
    expect(component.client.name).toBe('');
  });


  it('should emit close event and reset form on onClose', () => {
    spyOn(component.close, 'emit');
    spyOn(component, 'resetForm');

    component.onClose();

    expect(component.isOpen).toBeFalse();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should reset form correctly', () => {
    component.client = { name: 'Test', salary: 100, companyValuation: 1000 };
    component.isEditMode = true;
    component.clientToEdit = { id: 1, name: 'Test', salary: 100, companyValuation: 1000, selected: false };

    component.resetForm();

    expect(component.client.name).toBe('');
    expect(component.client.salary).toBe(0);
    expect(component.client.companyValuation).toBe(0);
    expect(component.isEditMode).toBeFalse();
    expect(component.clientToEdit).toBeUndefined();
  });

  it('should create a new client on onSubmit in create mode', () => {
    spyOn(component.clientCreated, 'emit');
    spyOn(component, 'onClose');

    component.isEditMode = false;
    component.client = { name: 'New Test Client', salary: 500, companyValuation: 2500 };
    fixture.detectChanges();

    component.onSubmit();

    expect(mockClientService.createClient).toHaveBeenCalledWith(component.client);
    expect(component.clientCreated.emit).toHaveBeenCalled();
    expect(component.onClose).toHaveBeenCalled();
  });

  it('should show alert if client creation fails', fakeAsync(() => {
    mockClientService.createClient.and.returnValue(throwError(() => new HttpErrorResponse({
      error: { message: 'Creation failed' },
      status: 500,
      statusText: 'Internal Server Error'
    })));

    component.isEditMode = false;
    component.client = { name: 'Fail Client', salary: 10, companyValuation: 20 };
    fixture.detectChanges();

    component.onSubmit();

    tick();

    expect(mockClientService.createClient).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Erro ao criar cliente: Creation failed'); // A string esperada
  }));

  it('should update an existing client on onSubmit in edit mode', () => {
  spyOn(component.clientUpdated, 'emit');
  spyOn(component, 'onClose');

  const existingClient: Client = { id: 5, name: 'Existing Client', salary: 1000, companyValuation: 5000, selected: false };
  component.isEditMode = true;
  component.clientToEdit = existingClient;

  component.client = { name: 'Updated Existing Client', salary: 1000, companyValuation: 5000 };
  fixture.detectChanges();

  component.onSubmit();

  const expectedClientDataToSend = { name: 'Updated Existing Client', salary: 1000, companyValuation: 5000 };
  expect(mockClientService.updateClient).toHaveBeenCalledWith(existingClient.id, expectedClientDataToSend);
  expect(component.clientUpdated.emit).toHaveBeenCalled();
  expect(component.onClose).toHaveBeenCalled();
  });

  it('should show alert if client update fails', fakeAsync(() => {
    mockClientService.updateClient.and.returnValue(throwError(() => new HttpErrorResponse({
      error: { message: 'Update failed' },
      status: 400,
      statusText: 'Bad Request'
    })));

    const existingClient: Client = { id: 6, name: 'Existing Client', salary: 1000, companyValuation: 5000, selected: false };
    component.isEditMode = true;
    component.clientToEdit = existingClient;
    component.client = { name: 'Updated Existing Client', salary: 1000, companyValuation: 5000 };
    fixture.detectChanges();

    component.onSubmit();

    tick();

    expect(mockClientService.updateClient).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Erro ao atualizar cliente: Update failed');
  }));

  it('should show alert if clientToEdit ID is invalid during update', () => {
    component.isEditMode = true;
    component.clientToEdit = { id: 'abc' as any, name: 'Invalid ID', salary: 100, companyValuation: 1000, selected: false };
    fixture.detectChanges();

    component.onSubmit();

    expect(alertSpy).toHaveBeenCalledWith('Não foi possível atualizar o cliente: ID inválido.');
    expect(mockClientService.updateClient).not.toHaveBeenCalled();
  });

});