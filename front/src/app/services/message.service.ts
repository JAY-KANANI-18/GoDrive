import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn:'root'
})

export class messageService{
  currentMessage = new BehaviorSubject<any>(null);
  constructor(private afm:AngularFireMessaging,private http:HttpClient){}



  requestPermission(){
    this.afm.requestToken.subscribe((token)=>{
      console.log(token);
    },(error)=>{
      console.log(error);
    })
  }

  recieveMessasging(){
    this.afm.messages.subscribe((payload)=>{
      // console.log('new msg recieved',payload.data);
      const notificationTitle = payload.notification?.title;

      // const notificationOptions = {
      //   body: payload.notification.body
      // };
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/assets/img/icons/history.png',
        vibrate: [200, 100, 200],
        sound: '/assets/soundss/success-fanfare-trumpets-6185.mp3'

      };

      new Notification(notificationTitle, notificationOptions);
      // this.currentMessage.next(payload)
    },(err)=>{
      console.log(err);
    })
  }
  getTokenandSend(msg:any){



    this.afm.getToken.subscribe(
      (token) => {
        console.log('Device token:', token);
          this.sendNotification(token,msg);

      },
      (error) => {
        console.error(error);
      }
    );

  }
   sendNotification(deviceToken: string,msg:any): void {
    console.log(deviceToken,'aaaaaaaaaaaaaaaaaaaaaaaa');

    const notification = {
      notification: {
        title: 'Reassign Rides',
        body: msg
        // sound: "/src/assets/sound/Notification - Notification.mp3"

      },
      to: deviceToken
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':'key=AAAA-17eewc:APA91bGTsVHJnBpdjbHDv6EraR-0LujP-iNwZcY0qpMPUpVHMWNUWGReL6N29o8_FK_8dxEfmabTQCcuzb2d8aUsJ-B3w99Po18W-GkH9OCYZ2Kc8w_VoeznmUr49EOCqDzl4X2L8HCA'
      })
    };

    this.http.post('https://fcm.googleapis.com/fcm/send', notification, httpOptions).subscribe({
      next:(data:any)=>{
        console.log(data);
      },error:(error)=>{
        console.log(error);
      }
    })

  }




}


