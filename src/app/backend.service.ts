import { Injectable } from '@angular/core';
import { Region } from './region'
import { RegionFeedback } from './region.feedback';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BackendService {
  constructor() { }

  submitQueries(regions: Region[]) {
    return new Observable<Region[]>((observer) => {
      // Just log to console for now 
      console.log(regions);

      // Eventually, make an HTTP request. For now, mock stuff.
      observer.next(this._mockLabelsForFeedback(regions))
      observer.complete()
    })
  }


  submitFeedback(regions: Region[]) {
    return new Observable((observer) => {
      // Just log to console for now 
      console.log(regions);

      // Eventually, make an HTTP request. For now, mock stuff.
      observer.next(this._mockLabelsForFeedback(regions))
      observer.complete()
    })
  }

  _mockLabelsForFeedback(regions: Region[]): Region[] {
    // Mock 3 randomly placed and sized intervals for each label
    var mocked_regions = [];
    var regionsPerLabel = 3;
    regions.forEach(region => {
      for (var i = 0; i < regionsPerLabel; i++) {
        var start = Math.random() * 44;
        var end = Math.min(44, start + Math.random() * 10 + 10);
        var mocked_region = new Region(Math.random().toString(36).substr(2, 5), region.label, start, end);
        mocked_regions.push(mocked_region);
      }
    });

    return mocked_regions;
  }

}
