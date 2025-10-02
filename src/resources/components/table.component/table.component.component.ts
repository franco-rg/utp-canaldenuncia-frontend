import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() displayedColumns: any[] = [];
  @Input() currentPage: number = 1;
  @Input() loading: boolean = false;

  @Output() pageChange = new EventEmitter<number>();

  ngOnInit() {
    this.onPageChange(this.currentPage);
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  get totalPages() {
    return Math.ceil((this.data?.[0]?.totalrows || 0) / this.pageSize);
  }

  getPageNumbers() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getActions(actions: any): any[] {
    return actions && typeof actions === 'object' ? Object.values(actions) : [];
  }
  

}

