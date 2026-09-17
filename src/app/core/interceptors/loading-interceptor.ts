import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize, identity } from 'rxjs';
import { LoadService } from '../services/load.service';
import { environment } from '../../../environments/environment';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadService = inject(LoadService);

  loadService.busy();

  return next(req).pipe(
    // delay(500),
    (environment.production ? identity : delay(500)),
    finalize(() => loadService.idle())
  );
};
