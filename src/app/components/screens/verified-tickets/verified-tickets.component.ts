import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/shared/services/Common/util.service';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';


interface TreeNode<T> {
  data: T;
}

interface FSEntry {
  email: string;
  publicKey: string;
  ticketID: string;
  status?: string;
}

@Component({
  selector: 'app-verified-tickets',
  templateUrl: './verified-tickets.component.html',
  styleUrls: ['./verified-tickets.component.scss']
})
export class VerifiedTicketsComponent implements OnInit {
  customColumn = 'email';
  defaultColumns = ['status', 'publicKey', 'ticketID'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<FSEntry>;

  totalTickets = 0;
  approvedTickets = 0;

  showSpinner = false;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.ASCENDING;
  ticketsUnavailable = false;

  private data: TreeNode<FSEntry>[] = [];

  constructor(private utilService: UtilService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.showSpinner = true;
    // this.route.snapshot.params.id
    //console.log(this.route.snapshot.params.eventID);
    const temp = await this.utilService.GetTicketToDisplayByEvent(this.route.snapshot.params.eventID);

    if (temp) {
      for (const entry of temp) {
        this.data.push({ data: entry });
        if (entry.status == 'approved') {
          this.approvedTickets++;
        }
      }

      this.totalTickets = this.data.length;
      this.dataSource = this.dataSourceBuilder.create(this.data);
      this.showSpinner = false;
      const lol = temp.length;
      // console.log(lol);
    } else {
      this.showSpinner = false;
      this.ticketsUnavailable = true;

    }
    // tslint:disable-next-line:forin



  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn == column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
}


