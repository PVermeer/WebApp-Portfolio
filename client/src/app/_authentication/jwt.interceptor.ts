import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          'x-token': currentUser.token,
          'x-refresh-token': currentUser.refreshToken
        }
      });
    }
    return next.handle(request).map((response: HttpEvent<any>) => {
      if (response instanceof HttpResponse) {
        const token = response.headers.get('x-token');
        const refreshToken = response.headers.get('x-refresh-token');
        const tokens = { token, refreshToken };

        if (tokens.token !== null && tokens.refreshToken !== null) {
          localStorage.setItem('currentUser', JSON.stringify(tokens));
        }
      }
      return response;
    });
  }
}

export const JwtInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true,
};
