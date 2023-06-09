import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { VehicleType } from 'src/app/pages/vehical type/vehical-type.component';
import { CoutryComponent } from 'src/app/pages/coutry/coutry.component';
import { VehiclePricingComponent } from 'src/app/pages/vehicle-pricing/vehicle-pricing.component';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { DriversComponent } from 'src/app/pages/drivers/drivers.component';
import { CreateRequestComponent } from 'src/app/pages/create-request/create-request.component';
import { RidesConfirmedRidesComponent } from 'src/app/pages/rides-confirmed-rides/rides-confirmed-rides.component';
import { RunningRequestComponent } from 'src/app/pages/running-request/running-request.component';
import { RideHistoryComponent } from 'src/app/pages/ride-history/ride-history.component';
import { SettingsComponent } from 'src/app/pages/settings/settings.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'vehicle-type', component: VehicleType },
  { path: 'country', component: CoutryComponent },
  { path: 'city', component: MapsComponent },
  { path: 'vehicle-pricing', component: VehiclePricingComponent },
  { path: 'users', component: UsersComponent },
  { path: 'drivers', component: DriversComponent },
  { path: 'create-request', component: CreateRequestComponent },
  { path: 'rides/confirmed-rides', component: RidesConfirmedRidesComponent },
  { path: 'drivers/Running-request', component: RunningRequestComponent },
  { path: 'rides/ride-history', component: RideHistoryComponent },
  { path: 'settings', component: SettingsComponent },

];
