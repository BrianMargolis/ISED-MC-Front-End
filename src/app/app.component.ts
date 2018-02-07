import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  regions = null;
  selectedRegion = null;
  labels = null;

  onUpdateRegions($regions) {
    this.regions = $regions;
  }

  onSelectRegion($region) {
    this.selectedRegion = $region;
  }

  onUpdateLabels($labels) {
    console.log($labels);
    this.labels = $labels;
  }

}
