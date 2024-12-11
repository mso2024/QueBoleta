import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoNegadoComponent } from './acceso-negado.component';

describe('AccesoNegadoComponent', () => {
  let component: AccesoNegadoComponent;
  let fixture: ComponentFixture<AccesoNegadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesoNegadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesoNegadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
