import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Region } from '../region'
import { QueryLabelingComponent } from '../query-labeling/query-labeling.component';

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
    setTimeout(() => { // hack to fix an angular issue with change detection: https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4
      this.selectRegion();
    });
  }

  get labels() {
    return this._labels;
  }

  @Output() onSelectRegionId = new EventEmitter<any>();

  labelIndex = 0;

  constructor() { }

  ngOnInit() {
  }

  prev() {
    if (this.labelIndex > 0) {
      this.labelIndex--;
    }
    this.selectRegion();
  }

  next() {
    if (this.labelIndex < this._labels.length - 1) {
      this.labelIndex++
    }
    this.selectRegion();
  }

  selectRegion() {
    if (this.labels && this.labels[this.labelIndex]) {
      this.onSelectRegionId.emit(this.labels[this.labelIndex].id)
    }
  }

  test($event) {
    console.log($event)
  }

}
