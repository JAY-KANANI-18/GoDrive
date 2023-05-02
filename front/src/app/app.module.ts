import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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

// import 'bootstrap';
// import 'jquery';
// import 'popper.js';

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
    RideHistoryComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
