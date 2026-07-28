import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideIcons } from '@ng-icons/core';
import {
  heroArrowsPointingOut,
  heroBars3,
  heroBuildingStorefront,
  heroCake,
  heroCheck,
  heroCheckCircle,
  heroChevronDown,
  heroClipboardDocumentList,
  heroCurrencyDollar,
  heroHome,
  heroNoSymbol,
  heroPencilSquare,
  heroPlusCircle,
  heroShoppingBag,
  heroTableCells,
  heroTrash,
  heroXMark
} from '@ng-icons/heroicons/outline';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';

registerLocaleData(localeEsAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: LOCALE_ID,
      useValue: 'es-AR'
    },
    provideIcons({
      heroHome,
      heroShoppingBag,
      heroTableCells,
      heroClipboardDocumentList,
      heroCurrencyDollar,
      heroBars3,
      heroBuildingStorefront,
      heroXMark,
      heroChevronDown,
      heroArrowsPointingOut,
      heroCake,
      heroCheck,
      heroCheckCircle,
      heroNoSymbol,
      heroPencilSquare,
      heroPlusCircle,
      heroTrash
    })
  ]
};
