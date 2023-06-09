import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingServiceService } from '../loading-service.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingServiceService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('gagagagagagaagaggag');
    this.loadingService.setLoading(true);
    let localtoken = localStorage.getItem('newToken')
    // request = request.clone({headers:request.headers.set('Authorization',localStorage.getItem('newToken'))})
    if (request.url.includes('fcm.googleapis.com/fcm/send')) {
      return next.handle(request);
    }
    request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + localtoken) })

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.loadingService.setLoading(false); // Set the loading state to false when the response is received
        }
      })
    );;
  }
}
