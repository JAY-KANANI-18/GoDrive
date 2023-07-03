import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {


  public loadingCount = false;

  showLoading() {
    this.loadingCount = true
    // Show loading indicator
  }

  hideLoading() {
    this.loadingCount  =false

  }




}
