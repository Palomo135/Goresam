import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiqueteraComponent } from './etiquetera.component';

describe('EtiqueteraComponent', () => {
  let component: EtiqueteraComponent;
  let fixture: ComponentFixture<EtiqueteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtiqueteraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtiqueteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
