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
    console.log(labels);
    this._labels = labels;
  }

  get labels() {
    return this._labels;
  }

  constructor() { }

  ngOnInit() {

  }

}
