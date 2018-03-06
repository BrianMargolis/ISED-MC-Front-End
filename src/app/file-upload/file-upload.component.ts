import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit  {
  @Output() onFileUpload = new EventEmitter<File>();
  @Output() onChangeVisualization = new EventEmitter<string>();
  @Input() showHelp: boolean;
  private _file: File = null;
  visualization: string;

  ngOnInit(): void {
    this.toggleVisualization();
  }

  input($event): void {
    this._file = $event.target.files[0]
  }

  upload(): void {
    if (this._file) {
      this.onFileUpload.emit(this._file)
    }
  }

  get hasFile(): boolean {
    return this._file != null;
  }

  toggleVisualization() {
    if (this.visualization == "waveform") {
      this.visualization = "spectrogram";
    } else {
      this.visualization = "waveform";
    }

    this.onChangeVisualization.emit(this.visualization);
  }
}
