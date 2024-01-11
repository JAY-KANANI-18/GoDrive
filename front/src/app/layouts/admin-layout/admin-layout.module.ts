import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VehicleType } from 'src/app/pages/vehical type/vehical-type.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { RunningRequestComponent } from 'src/app/pages/running-request/running-request.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ReactiveFormsModule,

  ],
  declarations: [
    DashboardComponent,
    MapsComponent,
    VehicleType,
    RunningRequestComponent
  ],
  providers:[BnNgIdleService]
})

export class AdminLayoutModule {}
