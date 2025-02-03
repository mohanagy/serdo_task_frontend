import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { GithubIntegrationService, MeResponse } from '../../services/github-integration.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  user: any;

  constructor(private githubService: GithubIntegrationService) { }

  ngOnInit(): void {
    this.githubService.getMe().subscribe({
      next: (res: MeResponse) => {
        const { user } = res
        this.isAuthenticated = !!user.accessToken;
        this.user = user;

      },
      error: (err) => {
        this.isAuthenticated = false;
        this.user = null;
      },
    });
  }

  connect(): void {
    this.githubService.connectToGithub();
  }
}
