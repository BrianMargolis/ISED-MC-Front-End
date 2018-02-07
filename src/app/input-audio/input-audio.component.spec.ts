import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAudioComponent } from './input-audio.component';

describe('InputAudioComponent', () => {
  let component: InputAudioComponent;
  let fixture: ComponentFixture<InputAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
