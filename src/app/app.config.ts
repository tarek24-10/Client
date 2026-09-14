import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import 'zone.js'
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { InitService } from './core/services/init.service';
import { lastValueFrom } from 'rxjs';
import { AccountService } from './core/services/account.service';
import { authInterceptor } from './core/interceptors/auth-interceptor';

function initializeApp(initService:InitService){
  return () => {lastValueFrom(initService.init()).finally(() =>
      {
        const splash = document.getElementById('initial-splash');
        if(splash){
          splash.remove();
        }
      });
    }
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // provideZoneChangeDetection( {eventCoalescing:true} ),
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor, authInterceptor])),
    provideAppInitializer( 
      () =>{
      const initializeFn = initializeApp(inject(InitService));
      return initializeFn();
    }
    )
  ]
};
