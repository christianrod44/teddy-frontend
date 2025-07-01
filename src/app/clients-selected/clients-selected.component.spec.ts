import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsSelectedComponent } from './clients-selected.component';

describe('ClientsSelectedComponent', () => {
  let component: ClientsSelectedComponent;
  let fixture: ComponentFixture<ClientsSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientsSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
