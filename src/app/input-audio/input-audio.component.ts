import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { } from 'colormap';
import { Region } from '../region';

@Component({
  selector: 'app-input-audio',
  templateUrl: './input-audio.component.html',
  styleUrls: ['./input-audio.component.scss']
})
export class InputAudioComponent implements OnInit {
  @Output() onSelectRegion = new EventEmitter<string>();
  @Output() onUpdateRegions = new EventEmitter<Region[]>();
  @Input() selectedRegionId;

  private _ws = null;

  // Annoyingly, the regions come back as an object with many region members, not a list. 
  // Angular templates can't iterate over an object, so let's turn it into a list now.
  // Also lets us use some of the psuedo-functional array operations like .map, .filter
  get regionList() {
    var regions = this._ws.regions.list;
    var region_list = [];
    for (var region_name in regions) {
      var region = regions[region_name];
      region_list.push(new Region(region.id, region.annotation, region.start, region.end));
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
      visualization: "spectrogram"
    });

    this._ws.load('assets/mus/the_liquid.mp3')

    var wavesurferLabels = Object.create(WaveSurfer.Labels);
    wavesurferLabels.init({
      wavesurfer: this._ws,
      container: '.labels'
    });

    this._ws.enableDragSelection();

    var input_audio = this;
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

  replaceRegions(regions: Region[]) {
    this._ws.clearRegions();
    console.log(regions);
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

  }

  // Update the app component about selecting an ID
  selectRegion(region) {
    this.onSelectRegion.emit(region.id);
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
    var selectedRegion = this._ws.regions.list[this.selectedRegionId];

    this.nearestRegion(region => region.start > selectedRegion.start, (soFar, current) => current.start < soFar.start ? current : soFar);
  }

  prevRegion() {
    var selectedRegion = this._ws.regions.list[this.selectedRegionId];

    this.nearestRegion(region => region.start < selectedRegion.start, (soFar, current) => current.start > soFar.start ? current : soFar);
  }

  nearestRegion(sidePred: (any) => boolean, nearestPred: (soFar: any, current: any) => any) {
    if (!this.selectedRegionId) {
      return;
    }

    var region_list = this.regionList;
    // Get all the regions on one side of the selected region
    var side = region_list.filter(sidePred)
    // If there are any, pick the closest one
    if (side.length > 0) {
      var nearest = side.reduce(nearestPred);
      this.selectRegion(nearest);
    }
  }
}
