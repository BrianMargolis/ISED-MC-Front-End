import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { InputAudioComponent } from './input-audio/input-audio.component';
import { QueryLabelingComponent } from './query-labeling/query-labeling.component';
import { BackendService } from './backend.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { LoadingComponent } from './loading/loading.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    InputAudioComponent,
    QueryLabelingComponent,
    FeedbackComponent,
    LoadingComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
