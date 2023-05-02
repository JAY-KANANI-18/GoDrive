import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private swPush: SwPush) { }

  public subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: 'your-application-server-key'
    })
    .then(subscription => console.log(subscription))
    .catch(err => console.error('Could not subscribe to notifications', err));
  }

  public unsubscribeFromNotifications() {
    this.swPush.unsubscribe()
    .then(() => console.log('Unsubscribed from notifications'))
    .catch(err => console.error('Could not unsubscribe from notifications', err));
  }

}
