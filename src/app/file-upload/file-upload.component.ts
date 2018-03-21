import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Visualization } from '../visualization';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() onOpenVisualization = new EventEmitter<Visualization>();
  @Input() showHelp: boolean;
  private _file: File = null;

  input($event): void {
    this._file = $event.target.files[0]
  }

  visualize(visualization_type: string): void {
    if (this._file) {
      const visualization = new Visualization(this._file, visualization_type);
      this.onOpenVisualization.emit(visualization);
    }
  }

  get hasFile(): boolean {
    return this._file != null;
  }
}
