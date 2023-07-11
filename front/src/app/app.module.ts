import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { CoutryComponent } from './pages/coutry/coutry.component';
import { VehiclePricingComponent } from './pages/vehicle-pricing/vehicle-pricing.component';
import { UsersComponent } from './pages/users/users.component';
import { DriversComponent } from './pages/drivers/drivers.component';
import { CreateRequestComponent } from './pages/create-request/create-request.component';
import { RidesConfirmedRidesComponent } from './pages/rides-confirmed-rides/rides-confirmed-rides.component';
import { RunningRequestComponent } from './pages/running-request/running-request.component';
import { SocketIoModule} from 'ngx-socket-io';
import { RideHistoryComponent } from './pages/ride-history/ride-history.component'
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import {  AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { SettingsComponent } from './pages/settings/settings.component';
import { DriverApprovePipe } from './services/pipes/driver-approve.pipe';
import { DriverStatusPipe } from './services/pipes/driver-status.pipe';
import { RideStatusPipe } from './services/pipes/ride-status.pipe';
import { NgIdleModule } from '@ng-idle/core';
import { UtcDatePipe } from './services/pipes/utc-date.pipe';
import { AuthInterceptorInterceptor } from './services/interceptor/auth-interceptor.interceptor';
import { RideAssignTypePipe } from './services/pipes/ride-assign-type.pipe';
import { PaymentModesPipe } from './services/pipes/payment-modes.pipe';
import { SafeResourceUrlPipe } from './services/pipes/safe-resource-url.pipe';
import { AppNumericOnlyDirective } from './services/directives/app-numeric-only.directive';
import { PaymentTypePipe } from './services/pipes/payment-type.pipe';
import { OnlyMobileDirective } from './services/directives/only-mobile.directive';

import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    NgbDropdownModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ReactiveFormsModule,
    NgbModule,
    NgIdleModule.forRoot(),
    MatSelectModule,
    MatIconModule,



    ToastrModule.forRoot({

    })


  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    CoutryComponent,
    VehiclePricingComponent,
    UsersComponent,
    DriversComponent,
    CreateRequestComponent,
    RidesConfirmedRidesComponent,
    RunningRequestComponent,
    RideHistoryComponent,
    SettingsComponent,
    DriverApprovePipe,
    DriverStatusPipe,
    RideStatusPipe,
    UtcDatePipe,
    RideAssignTypePipe,
    PaymentModesPipe,
    SafeResourceUrlPipe,
    AppNumericOnlyDirective,
    PaymentTypePipe,
    OnlyMobileDirective
  ],
  providers: [{provide:HTTP_INTERCEPTORS,        useClass:AuthInterceptorInterceptor,
    multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
