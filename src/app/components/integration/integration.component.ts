import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { GithubIntegrationService, MeResponse } from '../../services/github-integration.service';
import { AirtableIntegrationsService } from '../../services/airtable-integration.service';

@Component({
  standalone: true,
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss'],
  imports: [CommonModule, MatCardModule, MatExpansionModule, MatButtonModule],
})
export class IntegrationComponent implements OnInit {
  isAuthenticated = false;
  isGithubConnected = false;
  isAirtableConnected = false;
  user: any;

  constructor(
    private githubService: GithubIntegrationService,
    private airtableService: AirtableIntegrationsService,
  ) { }

  ngOnInit(): void {
    this.checkMe();
  }

  checkMe(): void {
    this.githubService.getMe().subscribe({
      next: (res: MeResponse) => {
        const { user, github, airtable } = res;
        this.isAuthenticated = !!user.accessToken;
        this.isGithubConnected = !!github?.accessToken;
        this.isAirtableConnected = !!airtable?.accessToken;
        this.user = user;
        this.user.connectedAt = new Date(this.user.connectedAt).toLocaleString();
      },
      error: () => {
        this.isAuthenticated = false;
        this.isGithubConnected = false;
        this.isAirtableConnected = false;
        this.user = null;
      },
    });
  }


  removeIntegration(service: string): void {
    if (!confirm(`Remove ${service.toUpperCase()} integration?`)) return;

    switch (service) {
      case 'github':
        this.removeGithubIntegration();
        break;
      case 'airtable':
        this.removeAirtableIntegration();
        break;
    }
  } removeGithubIntegration(): void {
    this.githubService.removeIntegration().subscribe({
      next: () => {
        this.isGithubConnected = false;
        this.user.github = null;
        alert('GitHub integration removed.');
      },
      error: (err) => {
        console.error('Error removing GitHub integration', err);
      },
    });
  }

  removeAirtableIntegration(): void {
    this.airtableService.removeIntegration().subscribe({
      next: () => {
        this.isAirtableConnected = false;
        this.user.airtable = null;
        alert('Airtable integration removed.');
      },
      error: (err) => {
        console.error('Error removing Airtable integration', err);
      },
    });
  }

  reconnectGithub(): void {
    this.githubService.reconnect()
  }

  reconnectAirtable(): void {
    this.airtableService.reconnect()
  }
  reconnect(service: string): void {
    switch (service) {
      case 'github':
        this.reconnectGithub();
        break;
      case 'airtable':
        this.reconnectAirtable();
        break;
    }
  }
}



