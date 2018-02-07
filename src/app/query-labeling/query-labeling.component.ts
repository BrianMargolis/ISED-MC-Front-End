import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-query-labeling',
  templateUrl: './query-labeling.component.html',
  styleUrls: ['./query-labeling.component.scss']
})
export class QueryLabelingComponent implements OnInit {
  @Input() regions;
  @Input() selectedRegion;
  regionLabels = {};

  ngOnInit() {
  }

  onKey(value, id) {
    this.regionLabels[id] = value;
  }

  submit() {
    console.log(this.regionLabels);
  }

}
