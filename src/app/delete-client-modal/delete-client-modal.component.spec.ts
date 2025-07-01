import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteClientModalComponent } from './delete-client-modal.component';
import { By } from '@angular/platform-browser';
import { Client } from '../models/client.model';
import { CommonModule } from '@angular/common';

describe('DeleteClientModalComponent', () => {
  let component: DeleteClientModalComponent;
  let fixture: ComponentFixture<DeleteClientModalComponent>;

  const mockClient: Client = {
    id: 1,
    name: 'Cliente Teste',
    salary: 1500,
    companyValuation: 7500,
    selected: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DeleteClientModalComponent,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the modal when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const modalElement = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modalElement).toBeNull();
  });

  it('should display the modal when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const modalElement = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modalElement).not.toBeNull();
  });

  it('should display the client name in the modal when clientToDelete is set', () => {
    component.isOpen = true;
    component.clientToDelete = mockClient;
    fixture.detectChanges();

    const clientNameElement = fixture.debugElement.query(By.css('.modal-body p strong'));
    expect(clientNameElement).not.toBeNull();
    expect(clientNameElement.nativeElement.textContent).toContain(mockClient.name);
  });

  it('should emit confirmDelete with client id when confirm button is clicked', () => {
    spyOn(component.confirmDelete, 'emit');
    component.isOpen = true;
    component.clientToDelete = mockClient;
    fixture.detectChanges();

    const confirmButton = fixture.debugElement.query(By.css('.modal-actions .confirm-button'));
    expect(confirmButton).not.toBeNull();

    confirmButton.nativeElement.click();

    expect(component.confirmDelete.emit).toHaveBeenCalledWith(mockClient.id);
  });

  it('should not emit confirmDelete if clientToDelete.id is undefined', () => {
    spyOn(component.confirmDelete, 'emit');
    component.isOpen = true;
    component.clientToDelete = { ...mockClient, id: undefined };
    fixture.detectChanges();

    const confirmButton = fixture.debugElement.query(By.css('.modal-actions .confirm-button'));
    expect(confirmButton).not.toBeNull();

    confirmButton.nativeElement.click();

    expect(component.confirmDelete.emit).not.toHaveBeenCalled();
  });
});