import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIcons } from '@ng-icons/core';
import { heroBars3, heroClipboardDocumentList, heroCurrencyDollar, heroHome, heroShoppingBag, heroTableCells, heroXMark } from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
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
