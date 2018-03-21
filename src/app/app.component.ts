import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import { InputAudioComponent } from './input-audio/input-audio.component';
import { BackendService } from './backend.service';
import { Region } from './region';
import { Visualization } from './visualization';


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
  suggestions: Region[] = [];
  regions: Region[] = [];
  labels: string[] = [];
  selectedRegionId: string = null;
  sessionId: string = null;
  hasSubmitted = false;
  loading = false;
  showHelp = true;
  visualization: string;

  onOpenVisualization($visualization: Visualization) {
    this.audio = $visualization.file;
    this.visualization = $visualization.visualizationType;
    // This begins the creation of the wavesurfer, so throw up the loading screen.
    this.loading = true;
  }

  onLoading(loading: boolean) {
    this.loading = loading;
    // Because this comes from an async method, change detection doesn't run.
    // Needs investigating for a better solution, but for right now just manually invoke change detection.
    this.changeDetectorRef.detectChanges()
  }

  onInitiateSession() {
    this.loading = true;
    this.backendService.initiateSession(this.audio, this.regions).subscribe(response => {
      this.sessionId = response.session_id;
      this.suggestions = response.regions;
      this.markAllOld();
      this.inputAudioComponent.addRegions(response.regions);
      this.markAsNew(response.regions);
      this.suggestions = this.regions.slice();
      this.loading = false;
    })

    for (var region of this.regions) {
      var label = region.label;
      if (!this.labels.includes(label)) {
        this.labels.push(label);
      }
    }

    this.hasSubmitted = true;
  }

  onSubmitFeedback() {
    this.loading = true;
    this.backendService.submitFeedback(this.suggestions, this.regions, this.sessionId).subscribe(response => {
      this.markAllOld();
      this.inputAudioComponent.addRegions(response.regions);
      this.markAsNew(response.regions)
      this.suggestions = this.regions.slice();
      this.loading = false;
    })
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
    if ($region_id) {
      $("region[data-id='" + $region_id + "']").addClass("selected");
      $("region[data-id!='" + $region_id + "']").removeClass("selected");
    } else {
      $("region").removeClass("selected");
    }
  }

  markAllOld() {
    $("region").removeClass("new");
  }

  markAsNew(regions: Region[]) {
    regions.forEach(region => {
      $("region[data-id='" + region.id + "']").addClass("new");
    });
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
  }

  handleKey($key) {
    if ($key.path[0].tagName != "INPUT") { // ignore stuff that's happening in text boxes
      var key = $key.key;
      switch (key) {
        case "Delete":
        case "Backspace":
          if (this.selectedRegionId) {
            this.inputAudioComponent.deleteRegion(this.selectedRegionId);
            this.selectedRegionId = null;
          }
          break;
        case " ":
          console.log("playpausing")  
          this.inputAudioComponent.playPause();
          break;
        case "ArrowLeft":
          this.inputAudioComponent.prevRegion();
          break;
        case "ArrowRight":
          this.inputAudioComponent.nextRegion();
          break;
        case "Escape":
          this.onSelectRegion(null);
          break;
        case "?":
          this.toggleHelp();
          break;
        case "Enter":
          this.lockSelectedRegion();
      }
    }
  }

  lockSelectedRegion() {
    if (this.selectedRegionId) {
      $("region[data-id='" + this.selectedRegionId + "']").removeClass("new");
    }
  }

  private _resize;
  onResize($event) {
    if (this.inputAudioComponent) {
      clearTimeout(this._resize);
      this._resize = setTimeout(this.inputAudioComponent.resizeWavesurfer, 100)
    }
  }
}
