import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule]
})
export class NavbarComponent {
  @Input() sidenav!: MatSidenav; // Accept sidenav as input


}
