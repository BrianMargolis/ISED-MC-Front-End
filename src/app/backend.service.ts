import { Injectable } from '@angular/core';
import { Region } from './region'
import { InitiationResponse } from './initiation.response'
import { FeedbackResponse } from './feedback.response'
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class BackendService {
  private ATTEMPT_LIMIT = 2;
  constructor(private http: HttpClient) { }

  initiateSession(audio: File, regions: Region[], n_try = 0): Observable<InitiationResponse> {
    return new Observable<InitiationResponse>((observer) => {
      // Just log to console for now 
      console.log(regions);

      const form: FormData = new FormData();
      form.append("audio", audio, audio.name)
      form.append("regions", JSON.stringify(regions))

      var endpoint = environment.backendEndpoint + "initiateSession";
      this.http.post(endpoint, form).subscribe(res => {
        console.log(res)
        var suggestions: Region[] = res['suggestions'];
        suggestions = suggestions.map(suggestion => {
          return new Region(suggestion['id'], suggestion['label'], suggestion['start'], suggestion['end'])
        })
        observer.next(new InitiationResponse(suggestions, res['session_id']))
        observer.complete()
      },
        error => {
          console.log("Connection to backend failed when trying to initiate session.");
          console.log(error);
          if (n_try < this.ATTEMPT_LIMIT) {
            n_try += 1;
            console.log("Retrying after failing " + n_try + " times.");
            this.initiateSession(audio, regions, n_try);
          }
        })
    })
  }


  submitFeedback(suggestions: Region[], feedback: Region[], session_id: string, n_try = 0): Observable<FeedbackResponse> {
    return new Observable<FeedbackResponse>((observer) => {
      const form: FormData = new FormData();
      form.append("suggestions", JSON.stringify(suggestions))
      form.append("feedback", JSON.stringify(feedback))
      form.append("session_id", session_id)

      var endpoint = environment.backendEndpoint + "submitFeedback";
      this.http.post(endpoint, form).subscribe(res => {
        var suggestions: Region[] = res['suggestions'];
        suggestions = suggestions.map(suggestion => {
          return new Region(suggestion['id'], suggestion['label'], suggestion['start'], suggestion['end'])
        })
        observer.next(new FeedbackResponse(suggestions))
        observer.complete()
      },
        error => {
          console.log("Connection to backend failed when trying to submit feedback.");
          console.log(error);
          if (n_try < this.ATTEMPT_LIMIT) {
            n_try += 1;
            console.log("Retrying after failing " + n_try + " times.");
            this.submitFeedback(suggestions, feedback, session_id, n_try);
          }
        })
    })
  }



  _mockLabelsForFeedback(regions: Region[]): Region[] {
    // Mock 3 randomly placed and sized intervals for each label
    var mocked_regions = [];
    var regionsPerLabel = 1;
    var trackLength = 10;
    var maxIntervalLength = 6;
    regions.forEach(region => {
      for (var i = 0; i < regionsPerLabel; i++) {
        var start = Math.random() * (trackLength - maxIntervalLength);
        var end = Math.min(trackLength, start + Math.random() * 3 + 3);
        var mocked_region = new Region(Math.random().toString(36).substr(2, 5), region.label, start, end);
        mocked_regions.push(mocked_region);
      }
    });

    return mocked_regions;
  }
}