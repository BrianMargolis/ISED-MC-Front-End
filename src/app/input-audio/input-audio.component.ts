import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as $ from 'jquery';
import { } from 'colormap';
import { Region } from '../region';

@Component({
  selector: 'app-input-audio',
  templateUrl: './input-audio.component.html',
  styleUrls: ['./input-audio.component.scss']
})
export class InputAudioComponent implements OnInit {
  @Output() onSelectRegion = new EventEmitter<string>();
  @Output() onLoading = new EventEmitter<boolean>();
  @Output() onUpdateRegions = new EventEmitter<Region[]>();
  @Input() selectedRegionId: string;
  @Input() audio: File;
  @Input() showHelp: boolean;
  @Input() visualization: string;
  @Input() colors: string[];
  @Input() hasInitiatedSession: boolean;
  duration: string;

  get position(): string {
    if (!this._ws) {
      return ''
    }

    var total_seconds = this._ws.getCurrentTime();
    return this.prettyPrintTime(total_seconds);
  }


  private _ws = null;

  private prettyPrintTime(total_seconds: any) {
    var seconds = Math.round(total_seconds % 60);
    var minutes = Math.round((total_seconds - seconds) / 60);
    var seconds_str = '';
    if (String(seconds).length == 1) {
      seconds_str = '0' + seconds
    } else {
      seconds_str = '' + seconds
    }
    return "" + minutes + ":" + seconds_str;
  }

  // Annoyingly, the regions come back as an object with many region members, not a list. 
  // Angular templates can't iterate over an object, so let's turn it into a list now.
  // Also lets us use some of the psuedo-functional array operations like .map, .filter
  get regionList(): Region[] {
    var regions = this._ws.regions.list;
    var region_list = [];
    for (var region_name in regions) {
      var region = regions[region_name];
      region_list.push(new Region(region.id, region.annotation, region.start, region.end));
    }
    return region_list;
  }

  get newRegionList(): Region[] {
    var regions = this._ws.regions.list;
    var region_list = [];
    for (var region_name in regions) {
      var region = regions[region_name];
      if (region.element.classList.contains("new")) {
        region_list.push(new Region(region.id, region.annotation, region.start, region.end));
      }
    }
    return region_list;
  }

  constructor() { }

  ngOnInit() {
    var height = 256;

    this._ws = WaveSurfer.create({
      container: '.input_audio',
      cursorColor: '#FFFFFF',
      // For the spectrogram the height is half the number of fftSamples
      fftSamples: height * 2,
      height: height,
      // Other color options: https://www.npmjs.com/package/colormap
      // Right now it seems that only jet works. Unclear why.
      colorMap: colormap({
        colormap: 'jet',
        nshades: height,
        format: 'rgb',
        alpha: 1
      }),
      scrollParent: true,
      normalize: true,
      visualization: this.visualization
    });

    this._ws.loadBlob(this.audio)
    var wavesurferLabels = Object.create(WaveSurfer.Labels);
    wavesurferLabels.init({
      wavesurfer: this._ws,
      container: '.labels',
      maxRows: 3
    });

    this._ws.enableDragSelection();

    var input_audio = this;


    this._ws.on('ready', function () {
      input_audio.duration = input_audio.prettyPrintTime(input_audio._ws.getDuration());
      input_audio.onLoading.emit(false);
    })

    this._ws.on('region-update-end', function (region) {
      input_audio.updateRegions();
    });
    this._ws.on('region-removed', function (region) {
      input_audio.updateRegions();
    });
    this._ws.on('region-created', function (region) {
      input_audio.updateRegions();
    });

    this._ws.on('region-click', function (region) {
      input_audio.selectRegion(region);
    })
  }

  addRegions(regions: Region[]) {
    // this._ws.clearRegions();
    this.selectRegion(null);
    regions.forEach(region => {
      this._ws.addRegion({
        "id": region.id,
        "start": region.start,
        "end": region.end
      })

      this.updateLabel(region)
    })
  }

  // Update the app component about changes to selections on the input audio
  updateRegions() {
    this.onUpdateRegions.emit(this.regionList);
  }

  updateLabel(region) {
    this._ws.regions.list[region.id].update({ "annotation": region.label })
    $("region[data-id='" + region.id + "']").css({ 'background-color': this.colors[region.label] });
    this.updateRegions();
  }

  // Update the app component about selecting an ID
  selectRegion(region) {
    if (!region) {
      return;
    }
    this._ws.seekAndCenter(region.start / this._ws.getDuration());
    this.onSelectRegion.emit(region.id);
  }

  // Allow the parent component to manipulate regions
  deleteRegion(regionId: string) {
    this.nextRegion();
    this._ws.regions.list[regionId].remove();
  }

  private _resize
  resizeWavesurfer() {
    clearTimeout(this._resize);
    const component = this;
    // Resize at most every quarter of a second because
    this._resize = setTimeout(function () {
      // turn scroll off and then back on again, causing wavesurfer to adjust for width changes
      component._ws.toggleScroll();
      component._ws.toggleScroll();
    }, 250)
  }

  isPlaying() {
    return this._ws.isPlaying();
  }

  playPause() {
    if (this._ws.isPlaying()) {
      this._ws.pause();
    } else {
      // if a region is selected, play that
      if (this.selectedRegionId) {
        var selectedRegion = this._ws.regions.list[this.selectedRegionId];
        this._ws.play(selectedRegion.start, selectedRegion.end);
      } else {
        this._ws.play();
      }
    }
  }

  // Chronological region navigation with arrow keys
  nextRegion() {
    if (this.hasInitiatedSession) {
      var region_list = this.newRegionList;
    } else {
      var region_list = this.regionList;
    }
    // Sort by start time
    region_list.sort(function (r, r2) {
      return Number(r.start > r2.start) // wrap with Number to make type checker happy
    })

    const component = this;
    const i = region_list.findIndex(function (region) {
      return region.id == component.selectedRegionId;
    })

    if (i < region_list.length - 1) {
      this.selectRegion(region_list[i + 1])
    }
  }

  prevRegion() {
    if (this.hasInitiatedSession) {
      var region_list = this.newRegionList;
    } else {
      var region_list = this.regionList;
    }
    // Sort by start time
    region_list.sort(function (r, r2) {
      return Number(r.start > r2.start) // wrap with Number to make type checker happy
    })

    const component = this;
    const i = region_list.findIndex(function (region) {
      return region.id == component.selectedRegionId;
    })

    if (i > 0) {
      this.selectRegion(region_list[i - 1])
    }
  }

  // Horizontal zoom
  zoomOut() {
    var current_zoom = this._ws.params.minPxPerSec;
    if (current_zoom - 5 > 0) {
      this._ws.zoom(current_zoom - 5)
    } else {
      this._ws.zoom(1)
    }
  }

  zoomIn() {
    var current_zoom = this._ws.params.minPxPerSec;
    this._ws.zoom(current_zoom + 5)
  }
}
