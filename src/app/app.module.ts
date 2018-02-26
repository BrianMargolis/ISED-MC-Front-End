import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InputAudioComponent } from './input-audio/input-audio.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { QueryLabelingComponent } from './query-labeling/query-labeling.component';
import { BackendService } from './backend.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    InputAudioComponent,
    QueryLabelingComponent,
    FeedbackComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
