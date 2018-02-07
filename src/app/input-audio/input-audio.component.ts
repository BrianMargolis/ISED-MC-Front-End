import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { } from 'colormap';
import { Region } from '../region';

@Component({
  selector: 'app-input-audio',
  templateUrl: './input-audio.component.html',
  styleUrls: ['./input-audio.component.scss']
})
export class InputAudioComponent implements OnInit {
  private _labels;

  @Input()
  set labels(labels: Region[]) {
    if (!labels) {
      return;
    }
    // Custom setter because I'll need it later almost certainly.
    this._labels = labels;
    console.log(labels);

    // Turn on labels
    // TODO: don't turn them on every time
    var wavesurferLabels = Object.create(WaveSurfer.Labels);
    wavesurferLabels.init({
      wavesurfer: this.ws,
      container: '.labels'
    });

    // Remove existing regions
    this.ws.clearRegions();

    var i = 0
    labels.forEach(label => {
      this.ws.addRegion({
        id: label.id,
        start: label.start,
        end: label.end
      });
      this.ws.regions.list[label.id].update({ "annotation": label.label })

    })
    console.log(this.ws.regions.list);
  }

  get labels() {
    return this._labels;
  }


  // TODO: specify type  
  @Output() onSelectRegionId = new EventEmitter<any>();
  @Output() onUpdateRegions = new EventEmitter<any>();
  ws = null;
  @Input() selectedRegionId;

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

  // Update the app component about changes to selections on the input audio
  updateRegions() {
    var regions = this.ws.regions.list;
    // Annoyingly, the regions come back as an object with many region members, not a list. 
    // Angular templates can't iterate over an object, so let's turn it into a list now.
    // Also lets us use some of the psuedo-functional array operations like .map, .filter
    var region_list = this._regionsToRegionList(regions);
    this.onUpdateRegions.emit(region_list);
  }

  selectRegion(region) {
    this.onSelectRegionId.emit(region.id);
  }

  // Playback
  playPause() {
    if (this.ws.isPlaying()) {
      this.ws.pause();
    } else {
      // if a region is selected, play that
      if (this.selectedRegionId) {
        var selectedRegion = this.ws.regions.list[this.selectedRegionId];
        this.ws.play(selectedRegion.start, selectedRegion.end);
      } else {
        this.ws.play();
      }
    }
  }

  nextRegion() {
    var selectedRegion = this.ws.regions.list[this.selectedRegionId];
    
    this.nearestRegion(region => region.start > selectedRegion.start, (soFar, current) => current.start < soFar.start ? current : soFar);
  }

  prevRegion() {
    var selectedRegion = this.ws.regions.list[this.selectedRegionId];
    
    this.nearestRegion(region => region.start < selectedRegion.start, (soFar, current) => current.start > soFar.start ? current : soFar);
  }

  nearestRegion(sidePred: (any) => boolean, nearestPred: (soFar: any, current: any) => any) {
    if (!this.selectedRegionId) {
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

  // Private utilities
  _regionsToRegionList(regions) {
    var region_list = [];
    for (var region_name in regions) {
      region_list.push(regions[region_name]);
    }
    return region_list;
  }
}
