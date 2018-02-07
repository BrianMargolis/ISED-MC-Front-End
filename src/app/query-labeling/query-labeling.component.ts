import { Component, OnInit, Input } from '@angular/core';
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-query-labeling',
  templateUrl: './query-labeling.component.html',
  styleUrls: ['./query-labeling.component.scss']
})
export class QueryLabelingComponent implements OnInit {
  @Input() regions;
  @Input() selectedRegion;
  regionLabels = {};

  constructor(private backendService: BackendService) {

  }

  ngOnInit() {
  }

  onKey(value, id) {
    this.regionLabels[id] = value;
  }

  submit() {
    this.backendService.submitQueries(this.regionLabels);
  }

}
