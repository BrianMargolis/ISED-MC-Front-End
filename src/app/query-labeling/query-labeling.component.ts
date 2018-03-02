import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BackendService } from '../backend.service'
import { Region } from '../region';

@Component({
  selector: 'app-query-labeling',
  templateUrl: './query-labeling.component.html',
  styleUrls: ['./query-labeling.component.scss']
})
export class QueryLabelingComponent implements OnInit {
  private _regions: Region[] = [];
  @Input() set regions(regions: Region[]) {
    if (!regions) {
      return;
    }
    // We want to modify the regions, not outright replace them. 
    // This is important because angular would otherwise recreate the DOM elements for each region every time they update, wiping out the text box. 
    var updated_regions = regions.slice();
    // Go through the existing regions and update them or remove them
    for (var i = 0; i < this._regions.length; i++) {
      var region = this._regions[i];

      var updated_region_index = updated_regions.findIndex(updated_region => region.id == updated_region.id);
      var updated_region = updated_regions[updated_region_index]

      if (updated_region) {
        updated_regions.splice(updated_region_index, 1)
        region.start = updated_region.start;
        region.end = updated_region.end;
        region.label = updated_region.label;
      } else {
        this._regions.splice(i, 1);
        i--;
      }
    }

    // Add new regions
    for (var updated_region of updated_regions) {
      this._regions.push(updated_region);
    }
  }
  get regions() {
    return this._regions
  }

  @Input() selectedRegionId: string;
  @Input() showHelp: boolean;
  
  @Output() onUpdateLabel = new EventEmitter<Region>();
  @Output() onSelectRegion = new EventEmitter<string>();
  @Output() onSubmit = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onKey(id: string, value: string) {
    this.updateLabel(id, value);
  }

  onFocus(id: string) {
    this.onSelectRegion.emit(id);
  }

  updateLabel(id: string, value: string) {
    var region = this.regions.filter(region => {
      return region.id == id
    })[0];

    region.label = value;
    this.onUpdateLabel.emit(region);
  }

  submit() {
    this.onSubmit.emit(null);
  }
}