import { RegionFeedback } from './region.feedback'

export class Region {
    readonly orig_label;
    readonly orig_start;
    readonly orig_end;

    constructor(public id: string, public label: string, public start: number, public end: number) {
        this.orig_label = label;
        this.orig_start = start;
        this.orig_end = end;
    }

}