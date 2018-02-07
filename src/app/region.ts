import { RegionFeedback } from './region.feedback'

export class Region {
    constructor(public id: string, public start: number, public end: number, public feedback: RegionFeedback) {

    }
}