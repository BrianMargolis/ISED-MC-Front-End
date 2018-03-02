import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent  {
  @Output() onFileUpload = new EventEmitter<File>();
  private _file: File = null;

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
}
