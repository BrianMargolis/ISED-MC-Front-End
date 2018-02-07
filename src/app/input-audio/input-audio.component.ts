import { Component, OnInit } from '@angular/core';
import {  } from '../../../lib/colormap.min.js'

@Component({
  selector: 'app-input-audio',
  templateUrl: './input-audio.component.html',
  styleUrls: ['./input-audio.component.scss']
})
export class InputAudioComponent implements OnInit {
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
  }

  playPause() {
    this.ws.playPause()
  }

}
