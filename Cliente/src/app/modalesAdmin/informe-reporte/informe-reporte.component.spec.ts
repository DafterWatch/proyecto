import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeReporteComponent } from './informe-reporte.component';

describe('InformeReporteComponent', () => {
  let component: InformeReporteComponent;
  let fixture: ComponentFixture<InformeReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
