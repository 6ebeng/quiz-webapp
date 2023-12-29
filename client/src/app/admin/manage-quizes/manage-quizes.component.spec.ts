import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuizesComponent } from './manage-quizes.component';

describe('ManageQuizesComponent', () => {
  let component: ManageQuizesComponent;
  let fixture: ComponentFixture<ManageQuizesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageQuizesComponent]
    });
    fixture = TestBed.createComponent(ManageQuizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
