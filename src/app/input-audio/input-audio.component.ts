import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { } from '../../../lib/colormap.min.js'

@Component({
  selector: 'app-input-audio',
  templateUrl: './input-audio.component.html',
  styleUrls: ['./input-audio.component.scss']
})
export class InputAudioComponent implements OnInit {
  // TODO: specify type
  @Output() onUpdateRegions = new EventEmitter<object>();
  ws = null;

  constructor() { }

  ngOnInit() {
    // TODO: make this work (https://www.npmjs.com/package/color-map)?
    var spectrogramColorMap = colormap();

    var height = 256;
    this.ws = WaveSurfer.create({
      container: '.input_audio',
      cursorColor: '#FFFFFF',
      // For the spectrogram the height is half the number of fftSamples
      fftSamples: height * 2,
      height: height,
      // colorMap: spectrogramColorMap
      // visualization: "spectrogram"
    });
    this.ws.params.visualization = "spectrogram"
    this.ws.params.feedback = "none"

    this.ws.load('https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3')

    this.ws.enableDragSelection();

    var input_audio = this;
    this.ws.on('region-updated', function (region) {
      input_audio.updateRegions();
    })
  }

  updateRegions() {
    var regions = this.ws.regions.list;
    // Annoyingly, the regions come back as an object with many region members, not a list. 
    // Angular templates can't iterate over an object, so let's turn it into a list now.
    // Also lets us use some of the psuedo-functional array operations like .map, .filter
    var region_list = [];
    for (var region_name in regions) {
      region_list.push(regions[region_name]);
    }
    this.onUpdateRegions.emit(region_list);
  }

  playPause() {
    this.ws.playPause()
  }

}
