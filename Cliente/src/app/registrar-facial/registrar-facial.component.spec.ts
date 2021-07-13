import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarFacialComponent } from './registrar-facial.component';

describe('RegistrarFacialComponent', () => {
  let component: RegistrarFacialComponent;
  let fixture: ComponentFixture<RegistrarFacialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarFacialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
