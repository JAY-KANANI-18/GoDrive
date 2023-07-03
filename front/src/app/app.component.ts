import { Component } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { LoadingServiceService } from './services/loading-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading:any
  title = 'argon-dashboard-angular';
  constructor(private messaging: AngularFireMessaging,public loadingserbice:LoadingServiceService){


    this.messaging.requestPermission.subscribe({
      next:(data:any)=>{
        console.log('permission granted!');
      },error:(error)=>{
        console.log('permission denied');
      }
    })

  }
showloading(){
  this.loadingserbice.showLoading()
  this.loading = true
}


}
