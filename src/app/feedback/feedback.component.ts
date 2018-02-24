import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Region } from '../region'
import { QueryLabelingComponent } from '../query-labeling/query-labeling.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() regions;
  @Input() selectedRegionId;
  @Output() onUpdateLabel = new EventEmitter<Region[]>();

  constructor() { }

  ngOnInit() {  }

  updateLabel(id: string, value: string) {
    var region = this.regions.filter(region => {
      return region.id == id
    })[0];

    region.label = value;
    this.onUpdateLabel.emit(region);
  }

}
