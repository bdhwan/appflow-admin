import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAppPage } from './new-app.page';

describe('NewAppPage', () => {
  let component: NewAppPage;
  let fixture: ComponentFixture<NewAppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAppPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
