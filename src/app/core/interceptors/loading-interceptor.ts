import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { LoadService } from '../services/load.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadService = inject(LoadService);

  loadService.busy();

  return next(req).pipe(
    delay(500),
    finalize(() => loadService.idle())
  );
};
