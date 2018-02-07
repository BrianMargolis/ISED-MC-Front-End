import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BackendService } from '../backend.service'
import { Region } from '../region';

@Component({
  selector: 'app-query-labeling',
  templateUrl: './query-labeling.component.html',
  styleUrls: ['./query-labeling.component.scss']
})
export class QueryLabelingComponent implements OnInit {
  @Input() regions;
  @Input() selectedRegion;
  regionLabels = {};

  @Output() onUpdateRegionsForFeedback = new EventEmitter<Region[]>();

  constructor(private backendService: BackendService) {

  }

  ngOnInit() {
  }

  onKey(value, id) {
    this.regionLabels[id] = value;
  }

  submit() {
    var regionsForFeedback = this.backendService.submitQueries(this.regions, this.regionLabels);

    regionsForFeedback.subscribe(data => this.onUpdateRegionsForFeedback.emit(data));
  }
}