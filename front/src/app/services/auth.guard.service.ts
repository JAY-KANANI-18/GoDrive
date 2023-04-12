
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PostsService } from './login.service';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate ,CanActivateChild {
  constructor( private router: Router,private postService:PostsService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.postService.isAuthenticated().then(
      (authenticated: boolean) => {
        if (authenticated) {
          return true;
        }

      }
    )
  }



  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean> | Promise<boolean>|boolean {
    return this.canActivate(route, state)
  }

}
