import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubIntegrationService, MeResponse } from '../../services/github-integration.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';

@Component({
  standalone: true,
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridModule
  ],
})
export class FindUserComponent implements OnInit {

  isAuthenticated = false;
  user: any;

  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    sortable: true,
    resizable: true,

  };
  rowData: any[] = [];
  searchTerm = '';

  currentPage = 1;
  pageSize = 20;
  totalRecords = 0;


  gridOptions: GridOptions = {
    suppressRowClickSelection: true,
    rowSelection: 'single',
    columnDefs: this.columnDefs,


  };
  filters = {
    user: '',
    repo: '',
    startDate: '',
    endDate: ''
  };


  constructor(private githubService: GithubIntegrationService) {
  }

  ngOnInit(): void {
    this.githubService.getMe().subscribe({
      next: (res: MeResponse) => {
        const { user } = res
        this.isAuthenticated = !!user.accessToken;
        this.user = user;
        if (this.isAuthenticated) {
          this.loadData();
        }
      },
      error: () => {
        this.isAuthenticated = false;
        this.user = null;
      },
    });
  }


  onSearchChange(value: string) {
    this.searchTerm = value;
    this.currentPage = 1;
  }


  loadData() {
    if (!this.isAuthenticated) {
      alert('You must be logged in to fetch GitHub data!');
      return;
    }
    this.githubService
      .fetchEntityData(
        'issues/completed',
        this.searchTerm,
        this.currentPage,
        this.pageSize,
      )
      .subscribe({
        next: (res) => {
          this.columnDefs = [
            { field: "ticketId", headerName: "Ticket ID", filter: true, sortable: true },
            { field: "title", headerName: "Title", filter: true, sortable: true },
            { field: "user", headerName: "User", filter: true, sortable: true },
            { field: "closed_at", headerName: "Closed At", filter: true, sortable: true },
            { field: "state_reason", headerName: "State Reason", filter: true, sortable: true },
            { field: "body", headerName: "Description", filter: true, sortable: true },
          ];
          this.rowData = res.data;
          this.totalRecords = res.totalCount || 0;
        },
        error: (err) => {
          console.error(err);
          if (err.status === 401) {
            alert('Unauthorized: Please connect to GitHub first.');
          }
        },
      });
  }


  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }
  }

  nextPage() {
    const maxPage = Math.ceil(this.totalRecords / this.pageSize);
    if (this.currentPage < maxPage) {
      this.currentPage++;
      this.loadData();
    }
  }

  applyFilters() {
    const queryParams: any = {
      user: this.filters.user || '',
      repo: this.filters.repo || '',
      startDate: this.filters.startDate || '',
      endDate: this.filters.endDate || '',

    };
    this.githubService.fetchEntityData('issues/completed',
      this.searchTerm,
      this.currentPage,
      this.pageSize,
      queryParams
    ).subscribe({
      next: (res) => {
        this.rowData = res.data;
        this.totalRecords = res.totalCount || 0;
      },
      error: (err) => {
        console.error(err);
        if (err.status === 401) {
          alert('Unauthorized: Please connect to GitHub first.');
        }
      }
    });
  }

}
