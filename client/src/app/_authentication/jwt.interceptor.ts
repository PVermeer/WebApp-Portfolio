import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
      const requestTokens = currentUser.tokens;
      request = request.clone({
        setHeaders: {
          'x-token': requestTokens.token,
          'x-refresh-token': requestTokens.refreshToken
        }
      });
    }

    return next.handle(request).map((response: HttpEvent<any>) => {
      if (response instanceof HttpResponse) {
        const token = response.headers.get('x-token');
        const refreshToken = response.headers.get('x-refresh-token');

        if (token && refreshToken) {
          const tokens = { token, refreshToken };

          const tokenSplit = token.split('.')[1];
          const replaced = tokenSplit.replace('-', '+').replace('_', '/');
          const payload = JSON.parse(atob(replaced));
          const local = { tokens, payload };

          localStorage.setItem('currentUser', JSON.stringify(local));
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
