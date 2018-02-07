import { Injectable } from '@angular/core';
import { Region } from './region'
import { RegionFeedback } from './region.feedback';

@Injectable()
export class BackendService {
  regionLabels = null;
  constructor() { }

  submitQueries(regionLabels: {}) {
    // Just log to console for now 
    console.log(regionLabels);
    // Save to help mock data later
    this.regionLabels = regionLabels;
  }

  getRegionsForFeedback() {
    // Mock data
    var regions = [];
    var mockedLabelsPerRegion = 5;
    for (var region_name in this.regionLabels) {
      for (var i = 0; i < mockedLabelsPerRegion; i++) {
        var start = Math.random() * 44;
        var end = Math.max(44, start + Math.random() * 10);
        var feedback = new RegionFeedback();
        var region = new Region(region_name, start, end, feedback);
        regions.push(region);
      }
    }

    return regions;
  }

  submitFeedback(regions: Region[]) {
    // Just log to console for now
    console.log(regions);
  }

}
