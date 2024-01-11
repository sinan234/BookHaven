import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmininquiryComponent } from './admininquiry.component';

describe('AdmininquiryComponent', () => {
  let component: AdmininquiryComponent;
  let fixture: ComponentFixture<AdmininquiryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmininquiryComponent]
    });
    fixture = TestBed.createComponent(AdmininquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
