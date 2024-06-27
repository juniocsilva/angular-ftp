import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeDocsComponent } from './pae-docs.component';

describe('AbaDocumentosComponent', () => {
  let component: PaeDocsComponent;
  let fixture: ComponentFixture<PaeDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
