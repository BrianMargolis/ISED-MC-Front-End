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
  submitted = false;

  @Output() onUpdateLabels = new EventEmitter<Region[]>();

  constructor(private backendService: BackendService) {

  }

  ngOnInit() {
  }

  onKey(value, id) {
    this.regionLabels[id] = value;
  }

  submit() {
    var labels = this.backendService.submitQueries(this.regions, this.regionLabels);

    labels.subscribe(data => {
      this.onUpdateLabels.emit(data);
      this.submitted = true;
    });
  }
}