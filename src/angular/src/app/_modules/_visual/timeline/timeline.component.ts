import { Component, OnInit, Input } from '@angular/core';
import { ContentPageDocumentLean } from '../../../../../../server/database/models/content/content.types';
import { SharedService } from '../../_shared/services/shared.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  @Input('page') page: ContentPageDocumentLean;

  public timeline: any[][];

  private mapTimeline() {

    const page = this.page;
    const timeline = page.lists.find(x => x.ref === 'timeline');

    this.timeline = timeline.list.reverse();
  }

  public isEven = (number: number) => this.sharedService.isEven(number);

  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.mapTimeline();
  }

}
