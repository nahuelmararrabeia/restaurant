import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideIcons } from '@ng-icons/core';
import { heroBars3, heroClipboardDocumentList, heroCurrencyDollar, heroHome, heroShoppingBag, heroTableCells, heroXMark } from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideIcons({
      heroHome,
      heroShoppingBag,
      heroTableCells,
      heroClipboardDocumentList,
      heroCurrencyDollar,
      heroBars3,
      heroXMark
    })
  ]
};
