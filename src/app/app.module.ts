
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';

import { environment } from 'src/environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
import { BodyComponent } from './components/common/body/body.component';
import { HeaderComponent } from './components/common/header/header.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EventListItemComponent } from './components/screens/events/event-listing/event-list-item/event-list-item.component';
import { EventListComponent } from './components/screens/events/event-listing/event-list/event-list.component';
import { APP_ROUTES } from './app.routing';
import { SignupComponent } from './components/screens/auth/signup/signup.component';
import { LoginComponent } from './components/screens/auth/login/login.component';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { QRCodeModule } from 'angularx-qrcode';
import { AuthGuardService } from './shared/services/Auth/auth.guard';
import { AdminGuardService } from './shared/services/Auth/admin.guard';

import { ScannerComponent } from './components/screens/scanner/scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NbMenuInternalService } from '@nebular/theme/components/menu/menu.service';
import { HomeComponent } from './components/screens/home/home.component';
import { VerifiedTicketsComponent } from './components/screens/verified-tickets/verified-tickets.component';
import { LoginGuardService } from './shared/services/Auth/login.guard';
import { IoAuthGuardService } from './shared/services/Auth/ioauth.guard';
import { ForgotPasswordComponent } from './components/screens/auth/forgot-password/forgot-password.component';
import { PrivacyPolicyComponent } from './components/screens/privacy-policy/privacy-policy.component';
import { TermsComponent } from './components/screens/terms/terms.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BodyComponent,
    HeaderComponent,
    SidebarComponent,
    EventListItemComponent,
    EventListComponent,
    SignupComponent,
    LoginComponent,
    ScannerComponent,
    VerifiedTicketsComponent,
    ForgotPasswordComponent,
    PrivacyPolicyComponent,
    TermsComponent

  ],
  imports: [
    BrowserModule,
    NbTreeGridModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES),
    AngularFireModule.initializeApp(environment.firebaseConfigs),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbLayoutModule,
    HttpClientModule,
    ZXingScannerModule.forRoot(),
    NbToastrModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbSelectModule,
    NbListModule,
    NbUserModule,
    NbSpinnerModule,
    NbDialogModule.forRoot({ closeOnBackdropClick: true, closeOnEsc: true }),
    FormsModule,
    QRCodeModule,
    NbContextMenuModule
  ],
  providers: [NbSidebarService, AuthGuardService, AdminGuardService, NbMenuService,
    NbMenuInternalService, LoginGuardService, IoAuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
