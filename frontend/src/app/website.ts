export interface Website {
    _id: string;
    websiteURL: string;
    addedDate: Date;
    lastDate: Date;
    ratingStatus: RatingStatus;
    moniteredPages: Page[];
}

export enum RatingStatus {
    TO_BE_RATED = "to be rated",
    BEING_RATED = "being rated",
    RATED = "rated",
    ERROR = "error"
}

export enum RatingResult{
    COMPLIANT = "compliant",
    NON_COMPLIANT = "non-compliant"
}
  
export interface Page {
    _id: string;
    websiteURL: string;
    lastDate: Date;
    ratingResult: RatingResult;
}