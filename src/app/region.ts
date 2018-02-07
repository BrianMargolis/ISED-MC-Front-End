import { RegionFeedback } from './region.feedback'

export class Region {
    constructor(private id: string, private start: number, private end: number, private feedback: RegionFeedback) {

    }
}