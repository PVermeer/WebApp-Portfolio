import { Component, OnInit, Input } from '@angular/core';
import { ContentPageDocumentLean } from '../../../../../../server/database/models/content/content.types';
import { SharedService } from '../../_shared/services/shared.service';

interface Timeline {
  year: string;
  items: {
    title: string;
    subtitle: string
  }[];
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  @Input('page') page: ContentPageDocumentLean;

  public timeline: Timeline[];

  private mapTimeline() {

    const page = this.page;
    const years = page.lists.find(x => x.ref === 'timeline_year');
    const titles = page.lists.find(x => x.ref === 'timeline_title');
    const subtitles = page.lists.find(x => x.ref === 'timeline_subtitle');

    const timeline: Timeline[] = [];

    years.list.map((x, i) => {

      const item = { title: titles.list[i], subtitle: subtitles.list[i] };

      const index = timeline.findIndex(y => y.year === x);

      if (index > -1) {
        timeline[index].items.push(item);
      } else {
        timeline.push({ year: x, items: [item] });
      }
    });

    this.timeline = timeline.reverse();
  }

  public isEven = (number: number) => this.sharedService.isEven(number);

  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.mapTimeline();
  }

}
