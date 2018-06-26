import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ContentPageDocumentLean } from '../../../../../../server/database/models/content/content.types';
import { SharedService } from '../../_shared/services/shared.service';

interface Timeline {
  year: string;
  items: { title: string, subtitle: string }[];
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit {

  @Input('page') page: ContentPageDocumentLean;

  public timeline: Timeline[];

  private mapTimeline() {

    const page = this.page;
    const timeline = page.lists.find(x => x.ref === 'timeline').list.reverse();
    const timelineObjectArray: Timeline[] = [];

    timeline.forEach((x, i) => {
      const length = timelineObjectArray.length;

      if (i > 0 && x[0] === timelineObjectArray[length - 1].year) {
        timelineObjectArray[length - 1].items.push({ title: x[1], subtitle: x[2] });
      } else {
        timelineObjectArray.push({ year: x[0], items: [{ title: x[1], subtitle: x[2] }] });
      }
    });

    this.timeline = timelineObjectArray;
  }

  public isEven = (number: number) => this.sharedService.isEven(number);

  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.mapTimeline();
  }

}
