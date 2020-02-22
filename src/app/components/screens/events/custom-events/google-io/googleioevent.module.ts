import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleIOEventRoutingModule } from './googleioevent.routing';

// Nebular Stuff
import {
  NbThemeModule,
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbLayoutModule,
  NbToastrModule,
  NbSidebarModule,
  NbSelectModule,
  NbListModule,
  NbUserModule,
  NbSidebarService,
  NbSpinnerModule,
  NbDialogModule,
  NbContextMenuModule,
  NbMenuService,
  NbTreeGridModule
} from '@nebular/theme';

// Components
import { GoogleioeventpageComponent } from './components/googleioeventpage/googleioeventpage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from 'src/app/shared/services/Auth/auth.guard';
import { NbMenuInternalService } from '@nebular/theme/components/menu/menu.service';
import { GoogleioregistrationComponent } from './components/googleioregistration/googleioregistration.component';
import { RsvpcomponentComponent as RsvpComponent } from './components/rsvpcomponent/rsvpcomponent.component';

@NgModule({
  imports: [CommonModule, GoogleIOEventRoutingModule, NbTreeGridModule,
    NbThemeModule.forRoot(),
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbLayoutModule,
    HttpClientModule,
    NbSelectModule,
    NbListModule,
    NbUserModule,
    NbSpinnerModule,
    NbDialogModule.forRoot({ closeOnBackdropClick: true, closeOnEsc: true }),
    NbContextMenuModule
  ],
  providers: [NbSidebarService, AuthGuardService, NbMenuService, NbMenuInternalService],
  declarations: [GoogleioeventpageComponent, GoogleioregistrationComponent, RsvpComponent]
})
export class GoogleIOEventModule { }
