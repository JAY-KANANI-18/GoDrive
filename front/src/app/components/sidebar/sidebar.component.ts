import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/services/login.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Rides', icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/tables', title: 'Users', icon: 'ni-bullet-list-67 text-red', class: '' },
  { path: '/maps', title: 'Drivers', icon: 'ni-pin-3 text-orange', class: '' },
  { path: '/user-profile', title: 'Pricing', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '' },
  { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '' },
  { path: '/icons', title: 'Settings', icon: 'ni-planet text-blue', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  submenu1: boolean = false;
  submenu2: boolean = false;
  sidebarOpen: boolean = false;
  drop = false
  drop2 = false
  drop3 = false

  toggleSubmenu(submenu: string) {
    if (submenu === 'submenu1') {
      this.submenu1 = !this.submenu1;
    } else if (submenu === 'submenu2') {
      this.submenu2 = !this.submenu2;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router, private postsService: PostsService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = false;
    });
  }
  show() { this.drop = !this.drop }
  show2() { this.drop2 = !this.drop2 }
  show3() { this.drop3 = !this.drop3 }

  onLogOut() {
    this.postsService.logOut()
    this.router.navigate(["/login"])
  }
}
