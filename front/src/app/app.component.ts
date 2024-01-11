import { Component, HostListener } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { LoadingServiceService } from './services/loading-service.service';
import { SocketService } from './services/soketio.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading: any
  title = 'argon-dashboard-angular';
  user: any
  constructor(private messaging: AngularFireMessaging, public loadingserbice: LoadingServiceService, private socketService: SocketService
  ) {

    window.onbeforeunload = () => this.handleBeforeUnload();


    this.messaging.requestPermission.subscribe({
      next: (data: any) => {
        console.log('permission granted!');
      }, error: (error) => {
        console.log('permission denied');
      }
    })

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.user = localStorage.getItem('UserObj')

    this.user = JSON.parse(this.user)
    this.socketService.msg_emit({ event: 'online', name: this.user.name, id: this.user._name })
  }
  showloading() {
    this.loadingserbice.showLoading()
    this.loading = true
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  handleBeforeUnload(): void {
    console.log('Beforeunload event: Website reload or tab close.');
    this.socketService.msg_emit({ event: 'offline', name: this.user.name, id: this.user._name })
    // You can add any necessary code here before the page unloads.
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: Event): void {
    this.socketService.msg_emit({ event: 'offline', name: this.user.name, id: this.user._name })
    console.log('Unload event: Website reload or tab close.');
    // You can add any necessary code here when the page is unloading.
  }

  



}
