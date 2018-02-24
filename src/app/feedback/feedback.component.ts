import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Region } from '../region'
import { QueryLabelingComponent } from '../query-labeling/query-labeling.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  private _labels: string[];
  labelsTabled: string[];
  @Input() set labels(labels: string[]) {
    this._labels = labels;

    var c = 6;
    var tabled = [];
    var raw = this.labels.slice();
    while (raw.length) {
      tabled.push(raw.splice(0, c))
    }

    this.labelsTabled = tabled;
  }
  get labels() {
    return this._labels;
  }
  @Input() regions: Region[];
  @Input() selectedRegionId: string;
  @Output() onUpdateLabel = new EventEmitter<Region>();
  @Output() onSubmit = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  updateLabel(value) {
    console.log(value);
    var region = this.regions.find(region => {
      return region.id == this.selectedRegionId
    });

    if (!region) {
      return;
    }
    region.label = value;
    this.onUpdateLabel.emit(region);
  }

  submit() {
    this.onSubmit.emit(null);
  }
}
