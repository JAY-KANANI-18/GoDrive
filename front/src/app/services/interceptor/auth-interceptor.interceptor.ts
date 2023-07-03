import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, finalize, of, tap, throwError } from "rxjs";
import { LoadingServiceService } from "../loading-service.service";
import { PostsService } from "../login.service";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingServiceService,
    private loginService: PostsService,
    private toster: ToastrService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let localtoken = localStorage.getItem("newToken");
    // this.loginService.autoLogout();
    this.loadingService.showLoading();

    // request = request.clone({headers:request.headers.set('Authorization',localStorage.getItem('newToken'))})
    if (request.url.includes("fcm.googleapis.com/fcm/send")) {
      return next.handle(request);
    }
    request = request.clone({
      headers: request.headers.set("Authorization", "Bearer " + localtoken),
    });

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
        }
      }),
      catchError((error) => {
        console.log(error);
        if (error.status === 401) {
          console.log("time to logout");

          this.loginService.logOut();
          // this.toster.error('session complete')
        }

        throw error;
      }),
      finalize(() => {
        this.loadingService.hideLoading();
      })
    );
  }
}
