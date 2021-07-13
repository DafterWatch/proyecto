import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconocimientoFacialComponent } from './reconocimiento-facial.component';

describe('ReconocimientoFacialComponent', () => {
  let component: ReconocimientoFacialComponent;
  let fixture: ComponentFixture<ReconocimientoFacialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconocimientoFacialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconocimientoFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
