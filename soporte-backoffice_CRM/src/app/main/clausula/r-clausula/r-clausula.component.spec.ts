import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RClausulaComponent } from './r-clausula.component';

describe('RClausulaComponent', () => {
  let component: RClausulaComponent;
  let fixture: ComponentFixture<RClausulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RClausulaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RClausulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
