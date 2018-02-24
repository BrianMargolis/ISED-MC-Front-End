import { Component, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { InputAudioComponent } from './input-audio/input-audio.component';
import { BackendService } from './backend.service';
import { Region } from './region';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(InputAudioComponent)
  private inputAudioComponent: InputAudioComponent;

  constructor(private backendService: BackendService) { }

  regions: Region[] = null;
  selectedRegionId: string = null;

  onUpdateRegions($regions) {
    this.regions = $regions;
  }

  SELECTED_COLOR = 'rgba(0, 0, 0, .6)'
  UNSELECTED_COLOR = 'rgba(0, 0, 0, .3)'
  onSelectRegion($region_id: string) {
    this.selectedRegionId = $region_id;

    // Using JQuery in Angular is nearly always a bad decision.
    // Here, it's the only option, because there's no way to slip a more Angular-esque 
    // concept like model binding into the wavesurfer API without heavy modifications
    // to the API
    // So, we use JQuery.
    $("region[data-id='" + $region_id + "']").css('backgroundColor', this.SELECTED_COLOR);
    $("region[data-id!='" + $region_id + "']").css('backgroundColor', this.UNSELECTED_COLOR);
  }

  onUpdateLabel($region: Region) {
    this.inputAudioComponent.updateLabel($region);
  }

  onSubmit() {
    var response = this.backendService.submitQueries(this.regions);
    response.subscribe(regions => {
      this.inputAudioComponent.replaceRegions(regions);
    })
  }

}
