import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioReportadoComponent } from './usuario-reportado.component';

describe('UsuarioReportadoComponent', () => {
  let component: UsuarioReportadoComponent;
  let fixture: ComponentFixture<UsuarioReportadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioReportadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioReportadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
