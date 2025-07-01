import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientCardComponent } from './client-card.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Client } from '../models/client.model';

describe('ClientCardComponent', () => {
  let component: ClientCardComponent;
  let fixture: ComponentFixture<ClientCardComponent>;
  let mockClient: Client;

  beforeEach(async () => {
    mockClient = {
      id: 1,
      name: 'Client Teste',
      salary: 1500,
      companyValuation: 7500,
      selected: false
    };

    await TestBed.configureTestingModule({
      imports: [
        ClientCardComponent,
        CommonModule,     
        CurrencyPipe 
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(ClientCardComponent);
    component = fixture.componentInstance;
    component.client = mockClient; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editClient event when edit button is clicked', () => {
    spyOn(component.editClient, 'emit');

    const editButton = fixture.debugElement.query(By.css('.action-button.edit'));
    expect(editButton).toBeTruthy();
    editButton.triggerEventHandler('click', null);

    expect(component.editClient.emit).toHaveBeenCalledWith(mockClient);
  });

  it('should emit deleteClient event when delete button is clicked', () => {
    spyOn(component.deleteClient, 'emit');

    const deleteButton = fixture.debugElement.query(By.css('.action-button.delete'));
    expect(deleteButton).toBeTruthy();
    deleteButton.triggerEventHandler('click', null);

    expect(component.deleteClient.emit).toHaveBeenCalledWith(mockClient);
  });

  it('should emit toggleSelection event when toggle button is clicked', () => {
    spyOn(component.toggleSelection, 'emit');

    const toggleButton = fixture.debugElement.query(By.css('.action-button.select-toggle'));
    expect(toggleButton).toBeTruthy();
    toggleButton.triggerEventHandler('click', null);

    expect(component.toggleSelection.emit).toHaveBeenCalledWith(mockClient);
  });

  it('should show plus icon when client is not selected', () => {
    component.client.selected = false;
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('.select-toggle img')).nativeElement as HTMLImageElement;
    expect(icon.src).toContain(component.addIcon);
  });

  it('should show minus icon when client is selected', () => {
    component.client.selected = true;
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('.select-toggle img')).nativeElement as HTMLImageElement;
    expect(icon.src).toContain(component.minusIcon);
  });
});