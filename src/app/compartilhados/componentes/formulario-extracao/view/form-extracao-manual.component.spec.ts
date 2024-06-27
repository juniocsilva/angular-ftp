import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExtracaoManualComponent } from './form-extracao-manual.component';

describe('ExtracaoManualComponent', () => {
  let component: FormExtracaoManualComponent;
  let fixture: ComponentFixture<FormExtracaoManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormExtracaoManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExtracaoManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
