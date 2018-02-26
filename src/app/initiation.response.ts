import { Region } from './region'

export class InitiationResponse {
    constructor(public regions: Region[], public session_id: string) {

    }
}
