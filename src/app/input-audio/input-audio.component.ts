import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { } from 'colormap';
import * as $ from 'jquery';

@Component({
  selector: 'app-input-audio',
  templateUrl: './input-audio.component.html',
  styleUrls: ['./input-audio.component.scss']
})
export class InputAudioComponent implements OnInit {
  // TODO: specify type  
  @Output() onSelectRegion = new EventEmitter<any>();
  @Output() onUpdateRegions = new EventEmitter<any>();
  ws = null;
  selectedRegion = null;

  constructor() { }

  ngOnInit() {
    // Other color options: https://www.npmjs.com/package/colormap
    // Right now it seems that only jet works. Unclear why.
    var spectrogramColorMap = colormap({
      colormap: 'jet',
      nshades: 256,
      format: 'rgb',
      alpha: 1
    });

    var height = 256;
    this.ws = WaveSurfer.create({
      container: '.input_audio',
      cursorColor: '#FFFFFF',
      // For the spectrogram the height is half the number of fftSamples
      fftSamples: height * 2,
      height: height,
      colorMap: spectrogramColorMap,
      visualization: "spectrogram"
    });

    this.ws.load('https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3')

    this.ws.enableDragSelection();

    var input_audio = this;
    this.ws.on('region-updated', function (region) {
      input_audio.updateRegions();
    });

    this.ws.on('region-click', function (region) {
      input_audio.selectRegion(region);
    })
  }

  updateRegions() {
    var regions = this.ws.regions.list;
    // Annoyingly, the regions come back as an object with many region members, not a list. 
    // Angular templates can't iterate over an object, so let's turn it into a list now.
    // Also lets us use some of the psuedo-functional array operations like .map, .filter
    var region_list = this._regionsToRegionList(regions);
    this.onUpdateRegions.emit(region_list);
  }

  selectRegion(region) {
    this.selectedRegion = region;
    this.onSelectRegion.emit(region);
    // Using JQuery in Angular is nearly always a bad decision.
    // Here, it's the only option, because there's no way to slip a more Angular-esque 
    // concept like model binding into the wavesurfer API without heavy modifications
    // to the API
    // So, we use JQuery.
    var region_name = region.id;
    $("region[data-id='" + region_name + "']").css('backgroundColor', 'rgba(0, 0, 0, .6)');
    $("region[data-id!='" + region_name + "']").css('backgroundColor', 'rgba(0, 0, 0, .3)');
  }

  playPause() {
    if (this.ws.isPlaying()) {
      this.ws.pause();
    } else {
      // if a region is selected, play that
      if (this.selectedRegion) {
        this.ws.play(this.selectedRegion.start, this.selectedRegion.end);
      } else {
        this.ws.play();
      }
    }
  }

  nextRegion() {
    this.nearestRegion(region => region.start > this.selectedRegion.start, (soFar, current) => current.start < soFar.start ? current : soFar);
  }

  prevRegion() {
    this.nearestRegion(region => region.start < this.selectedRegion.start, (soFar, current) => current.start > soFar.start ? current : soFar);
  }

  nearestRegion(sidePred: (any) => boolean, nearestPred: (soFar: any, current: any) => any) {
    if (!this.selectedRegion) {
      return;
    }

    var regions = this.ws.regions.list;
    var region_list = this._regionsToRegionList(regions);
    // Get all the regions on one side of the selected region
    var side = region_list.filter(sidePred)
    // If there are any, pick the closest one
    if (side.length > 0) {
      var nearest = side.reduce(nearestPred);
      this.selectRegion(nearest);
    }
  }

  _regionsToRegionList(regions) {
    var region_list = [];
    for (var region_name in regions) {
      region_list.push(regions[region_name]);
    }
    return region_list;
  }
}
