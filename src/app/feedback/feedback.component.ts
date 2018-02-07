import { Component, OnInit, Input } from '@angular/core';
import { Region } from '../region'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  private _labels;

  @Input()
  set labels(labels) {
    // Custom setter because I'll need it later almost certainly.
    this._labels = labels;
  }

  get labels() {
    return this._labels;
  }

  constructor() { }

  ngOnInit() {

  }

}
