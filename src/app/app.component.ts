import { Component } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  regions = null;
  selectedRegionId = null;
  labels = null;

  onUpdateRegions($regions) {
    this.regions = $regions;
  }

  SELECTED_COLOR = 'rgba(0, 0, 0, .6)'
  UNSELECTED_COLOR = 'rgba(0, 0, 0, .3)'
  onSelectRegionId($region_id) {
    this.selectedRegionId = $region_id;

    // Using JQuery in Angular is nearly always a bad decision.
    // Here, it's the only option, because there's no way to slip a more Angular-esque 
    // concept like model binding into the wavesurfer API without heavy modifications
    // to the API
    // So, we use JQuery.
    $("region[data-id='" + $region_id + "']").css('backgroundColor', this.SELECTED_COLOR);
    $("region[data-id!='" + $region_id + "']").css('backgroundColor', this.UNSELECTED_COLOR);
  }

  onUpdateLabels($labels) {
    console.log($labels);
    this.labels = $labels;
  }

}
