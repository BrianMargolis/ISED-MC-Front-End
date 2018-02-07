import { RegionFeedback } from './region.feedback'

export class Region {
    constructor(public id: string, public label: string, public start: number, public end: number, public feedback: RegionFeedback) {

    }
}