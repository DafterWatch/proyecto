import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesClienteComponent } from './reportes-cliente.component';

describe('ReportesClienteComponent', () => {
  let component: ReportesClienteComponent;
  let fixture: ComponentFixture<ReportesClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
