import { RegionFeedback } from './region.feedback'

export class Region {
    private _orig_label;
    get orig_label() {
        return this._orig_label;
    }

    constructor(public id: string, public label: string, public start: number, public end: number) {
        this._orig_label = label;
    }
    
}