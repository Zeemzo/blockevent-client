
import { Routes } from '@angular/router';
import { EventListComponent } from './components/screens/events/event-listing/event-list/event-list.component';
import { LoginComponent } from './components/screens/auth/login/login.component';
import { SignupComponent } from './components/screens/auth/signup/signup.component';
import { AuthGuardService } from './shared/services/Auth/auth.guard';
import { ScannerComponent } from './components/screens/scanner/scanner.component';
import { HomeComponent } from './components/screens/home/home.component';
import { VerifiedTicketsComponent } from './components/screens/verified-tickets/verified-tickets.component';
import { LoginGuardService } from './shared/services/Auth/login.guard';
import { IoAuthGuardService } from './shared/services/Auth/ioauth.guard';
import { ForgotPasswordComponent } from './components/screens/auth/forgot-password/forgot-password.component';
import { TermsComponent } from './components/screens/terms/terms.component';
import { PrivacyPolicyComponent } from './components/screens/privacy-policy/privacy-policy.component';
import { AdminGuardService } from './shared/services/Auth/admin.guard';


export const APP_ROUTES: Routes = [

    { path: 'events', component: EventListComponent, canActivate: [AuthGuardService] },
    { path: 'scanTicket', component: ScannerComponent, canActivate: [AdminGuardService] },
    { path: 'register', component: SignupComponent, canActivate: [LoginGuardService] },
    { path: 'terms', component: TermsComponent },
    { path: 'privacy', component: PrivacyPolicyComponent},
    { path: 'login', component: LoginComponent, canActivate: [LoginGuardService] },
    { path: 'tickets/:eventID', component: VerifiedTicketsComponent, canActivate: [AuthGuardService] },
    // {
    //     path: 'io19lk', loadChildren: './components/screens/events/custom-events/google-io/googleioevent.module#GoogleIOEventModule'
    //     , canActivate: [IoAuthGuardService]
    // },
    { path: '', component: HomeComponent },

    // { path: '', redirectTo: '/login' },
    { path: '**', redirectTo: '/', pathMatch: 'full' },

];
