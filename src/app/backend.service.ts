import { Injectable } from '@angular/core';
import { Region } from './region'
import { RegionFeedback } from './region.feedback';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BackendService {
  regionLabels = null;
  constructor() { }

  submitQueries(regions: any[], regionLabels: {}) {
    return new Observable<Region[]>((observer) => {
      // Just log to console for now 
      console.log(regions);
      console.log(regionLabels);

      this.regionLabels = regionLabels;

      // Eventually, make an HTTP request. For now, mock stuff.
      observer.next(this._mockRegionsForFeedback())
      observer.complete()
    })
  }


  submitFeedback(regions: Region[]) {
    return new Observable((observer) => {
      // Just log to console for now 
      console.log(regions);

      // Eventually, make an HTTP request. For now, mock stuff.
      observer.next(this._mockRegionsForFeedback())
      observer.complete()
    })
  }

  _mockRegionsForFeedback(): Region[] {
    // Mock 5 randomly placed and sized intervals for each label
    var regions = [];
    var mockedLabelsPerRegion = 5;
    for (var region_name in this.regionLabels) {
      for (var i = 0; i < mockedLabelsPerRegion; i++) {
        var start = Math.random() * 44;
        var end = Math.min(44, start + Math.random() * 10);
        var feedback = new RegionFeedback();
        var region = new Region(region_name, start, end, feedback);
        regions.push(region);
      }
    }

    return regions;
  }

}
