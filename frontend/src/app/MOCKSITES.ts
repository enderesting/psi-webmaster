import { Website, RatingStatus, RatingResult, Page } from './website';

// TODO: replace this with real data from your application
const TIME_1 = new Date('December 15, 2024 04:28:00');	
const TIME_2 = new Date('December 16, 2024 04:28:00');	
const TIME_3 = new Date('December 17, 2024 04:28:00');	
const EXAMPLE_PAGES: Page[] = [
  {_id: "1", websiteURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    pageURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    lastEvalDate: TIME_3, ratingResult: RatingResult.NONE},
]
export const EXAMPLE_SITES: Website[] = [
  {_id: "1", websiteURL: 'www.youtube.com', 
    addedDate: TIME_1, lastEvalDate: TIME_2,
    ratingStatus: RatingStatus.TO_BE_RATED,
    moniteredPages:EXAMPLE_PAGES},
  {_id: "2", websiteURL: 'https://www.w3schools.com/', 
    addedDate: TIME_2, lastEvalDate: TIME_3,
    ratingStatus: RatingStatus.BEING_RATED,
    moniteredPages:[]},
  {_id: "3", websiteURL: 'https://maia.crimew.gay/', 
    addedDate: TIME_2, lastEvalDate: TIME_3,
    ratingStatus: RatingStatus.RATED,
    moniteredPages:[]},
];