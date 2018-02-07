import { Injectable } from '@angular/core';

@Injectable()
export class BackendService {

  constructor() { }

  submitQueries(regionLabels) {
    // Just log to console for now
    console.log(regionLabels);
  }

  getRegionsForFeedback() {
    // Mock data

  }

  submitFeedback() {
    // Just log to console for now
  }

}
