import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatChip, MatChipsModule} from '@angular/material/chips';
import { RatingStatus } from '../website';


/**
 * @title Basic chips
 */
@Component({
  selector: 'status-filter',
  templateUrl: 'status-filter.component.html',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
})

export class StatusFilterComponent {
  public RatingStatus = RatingStatus;

  ratingStatus = RatingStatus;
  statuses():Array<string>{
    var statuses = Object.keys(this.ratingStatus)
    return statuses
  }

  toggleSelection(chip: MatChip) {
    if (chip.highlighted == false) chip.highlighted = true;
    else chip.highlighted = false;
    
 }
 
 
}
