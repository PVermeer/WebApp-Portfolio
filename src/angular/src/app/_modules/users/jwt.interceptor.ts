import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginPayload } from '../../../../../server/routes/users/users.types';


export interface CurrentUser {
  payload: LoginPayload;
  tokens: {
    token: string;
    refreshToken: string;
  };
}

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Outgoing request
    const currentUser: CurrentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
      if (currentUser.tokens) {
        const requestTokens = currentUser.tokens;

        // Clone the request with token headers
        request = request.clone({
          setHeaders: {
            'x-token': requestTokens.token,
            'x-refresh-token': requestTokens.refreshToken
          }
        });
      }
    }

    // Check for new tokens on incomming responses
    return next.handle(request).pipe(map((response: HttpEvent<any>) => {
      if (response instanceof HttpResponse) {

        // Get tokens from headers
        const token = response.headers.get('x-token');
        const refreshToken = response.headers.get('x-refresh-token');

        if (token && refreshToken) {
          const tokens = { token, refreshToken };

          // Process the tokens
          const tokenSplit = token.split('.')[1];
          const replaced = tokenSplit.replace('-', '+').replace('_', '/');
          const payload = JSON.parse(atob(replaced));
          const user: CurrentUser = { tokens, payload };

          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }
      return response;
    }));
  }
}

export const JwtInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true,
};
