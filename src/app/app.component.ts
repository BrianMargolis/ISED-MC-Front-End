import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
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

  constructor(private backendService: BackendService, private changeDetectorRef: ChangeDetectorRef) { }
  audio: File;

  regions: Region[] = [];
  labels: string[] = [];
  selectedRegionId: string = null;

  hasSubmitted = false;
  loading = false;

  onFileUpload($file) {
    this.audio = $file;
    this.loading = true;
  }

  onLoading(loading: boolean) {
    this.loading = loading;
    // Because this comes from an async method, change detection doesn't run.
    // Needs investigating for a better solution, but for right now just manually invoke change detection.
    this.changeDetectorRef.detectChanges()
  }

  onSubmit() {
    var response = this.backendService.initiateSession(this.audio, this.regions);
    for (var region of this.regions) {
      var label = region.label;
      if (!this.labels.includes(label)) {
        this.labels.push(label);
      }
    }
    console.log(this.labels);
    response.subscribe(res => {
      this.inputAudioComponent.replaceRegions(res.regions);
    })
    this.hasSubmitted = true;
  }

  onUpdateRegions($regions) {
    this.regions = $regions;
  }

  onUpdateLabel($region: Region) {
    this.inputAudioComponent.updateLabel($region);
  }

  onSelectRegion($region_id: string) {
    var SELECTED_COLOR = 'rgba(0, 0, 0, .6)'
    var UNSELECTED_COLOR = 'rgba(0, 0, 0, .3)'
    this.selectedRegionId = $region_id;

    // Using JQuery in Angular is nearly always a bad decision.
    // Here, it's the only option, because there's no way to slip a more Angular-esque 
    // concept like model binding into the wavesurfer API without heavy modifications
    // to the API
    // So, we use JQuery.
    $("region[data-id='" + $region_id + "']").css('backgroundColor', SELECTED_COLOR);
    $("region[data-id!='" + $region_id + "']").css('backgroundColor', UNSELECTED_COLOR);
  }

}
