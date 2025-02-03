import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubIntegrationService, MeResponse } from '../../services/github-integration.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { AirtableIntegrationsService } from '../../services/airtable-integration.service';

@Component({
  standalone: true,
  selector: 'app-data-browser',
  templateUrl: './data-browser.component.html',
  styleUrls: ['./data-browser.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AgGridModule
  ],
})
export class DataBrowserComponent implements OnInit {

  integrations = [
    { label: 'Select Integration', value: '' },
    { label: 'GitHub', value: 'github' },
    { label: 'Airtable', value: 'airtable' },

  ];
  selectedIntegration = '';


  githubEntities = ['organizations', 'repos', 'commits', 'pulls', 'issues', 'organizations-users'];
  airtableEntities = ['bases', 'tables', 'tickets', 'revision'];
  entities: string[] = [];
  selectedEntity = '';

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

  constructor(private githubService: GithubIntegrationService,
    private airtableService: AirtableIntegrationsService

  ) { }

  ngOnInit(): void {

    this.githubService.getMe().subscribe({
      next: (res: MeResponse) => {
        const { user } = res
        this.isAuthenticated = !!user.accessToken;
        this.user = user;
      },
      error: () => {
        this.isAuthenticated = false;
        this.user = null;
      },
    });
  }

  onIntegrationChange(value: string) {
    this.selectedIntegration = value;
    this.entities = this.selectedIntegration === 'github' ? this.githubEntities : this.airtableEntities;
    this.selectedEntity = this.entities[0];
    this.currentPage = 1;
    if (['github', 'airtable'].includes(this.selectedIntegration)) {
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


      this.loadData();
    }
    else {
      this.columnDefs = [];
      this.rowData = [];
    }
  }


  onEntityChange(value: string) {
    this.selectedEntity = value;
    this.currentPage = 1;
    this.loadData();

  }


  onSearchChange(value: string) {
    this.searchTerm = value;
    this.currentPage = 1;
    this.loadData();

  }


  loadGithubData() {
    if (this.selectedIntegration !== 'github') {
      return;
    }
    if (!this.isAuthenticated) {
      alert('You must be logged in to fetch GitHub data!');
      return;
    }
    this.githubService
      .fetchEntityData(
        this.selectedEntity,
        this.searchTerm,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (res) => {

          const raw = Array.isArray(res.data) ? res.data : [res.data];

          this.rowData = raw;
          this.totalRecords = res.totalCount || 0;

          if (this.rowData.length > 0) {
            const firstItem = this.rowData[0];
            const colFields = Object.keys(firstItem);

            this.columnDefs = colFields.map((field) => ({
              field,
            }));
          } else {
            this.columnDefs = [];
          }
        },
        error: (err) => {
          console.error(err);
          if (err.status === 401) {
            alert('Unauthorized: Please connect to GitHub first.');
          }
        },
      });
  }

  loadAirtableData() {
    if (this.selectedIntegration !== 'airtable') {
      return;
    }
    if (!this.isAuthenticated) {
      alert('You must be logged in to fetch Airtable data!');
      return;
    }

    this.airtableService
      .fetchEntityData(
        this.selectedEntity,
        this.searchTerm,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (res) => {


          this.rowData = res.data;
          this.totalRecords = res.totalCount || 0;
          if (this.rowData.length > 0) {
            const firstItem = this.rowData[0];
            const colFields = Object.keys(firstItem);

            this.columnDefs = colFields.map((field) => ({
              field,
            }));
          } else {
            this.columnDefs = [];
          }
        },
        error: (err) => {
          console.error(err);
          if (err.status === 401) {
            alert('Unauthorized: Please connect to Airtable first.');
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

  loadData() {
    switch (this.selectedIntegration) {
      case 'github':
        this.loadGithubData();
        break;
      case 'airtable':
        this.loadAirtableData();
        break;
    }
  }
}
