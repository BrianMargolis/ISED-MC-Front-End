import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryLabelingComponent } from './query-labeling.component';

describe('QueryLabelingComponent', () => {
  let component: QueryLabelingComponent;
  let fixture: ComponentFixture<QueryLabelingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryLabelingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryLabelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
