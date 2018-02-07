import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-audio',
  templateUrl: './input-audio.component.html',
  styleUrls: ['./input-audio.component.scss']
})
export class InputAudioComponent implements OnInit {
  ws = null;

  constructor() { }

  ngOnInit() {
    var height = 256;
    this.ws = WaveSurfer.create({
      container: '.input_audio',
      waveColor: '#FF00FF',
      progressColor: '#FF00FF',
      // For the spectrogram the height is half the number of fftSamples
      fftSamples: height * 2,
      height: height
    });

    this.ws.load('https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3')

    this.ws.enableDragSelection();
  }

  pause() {
    console.log("a")
  }

}
