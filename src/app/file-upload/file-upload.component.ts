import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  constructor() { }

  @Output() onFileUpload = new EventEmitter<File>();
  private _file: File = null;
  ngOnInit() { }

  input($event) {
    this._file = $event.target.files[0]
  }

  upload(a) {
    if (this._file) {
      this.onFileUpload.emit(this._file)
    }
  }
}
