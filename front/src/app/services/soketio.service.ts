import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Socket,io } from 'socket.io-client';
import io from 'socket.io-client/dist/socket.io.js';



@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any
  rideData: any
  constructor() {

    this.socket = io('http://localhost:3000', {
      forceNew: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      console.log(this.socket.id);
    });
  }

  fromAdminassign(data: any) {
    this.socket.emit('request_select_assign', data);


  }
  toDriver_emit(data: any) {
    this.socket.emit('toDriver', data);


  }

  toDriver_on(): Observable<any> {


    return new Observable<any>(observer => {

      this.socket.on('toDriver', (data: any) => {
        observer.next(data);
      });
    });
  }

  changeDriverStatusOn() {
    return new Observable<any>(observer => {

      this.socket.on('driver_status_change', (data: any) => {
        observer.next(data);
      });
    });


  }
  changeDriverStatusEmit(data: any) {
    this.socket.emit('driver_status_change', data);


  }
  changeRideStatusOn() {
    return new Observable<any>(observer => {

      this.socket.on('ride_status_change', (data: any) => {
        observer.next(data);
      });
    });


  }
  rideAutoAssignOn() {
    return new Observable<any>(observer => {

      this.socket.on('ride_auto_assign', (data: any) => {
        observer.next(data);
      });
    });
  }
  notificationOn() {
    return new Observable<any>(observer => {

      this.socket.on('notification', (data: any) => {
        observer.next(data);
      });
    });


  }
  rideAutoAssignEmit(data: any) {
    this.socket.emit('ride_auto_assign', data);


  }
  changeRideStatusEmit(data: any,) {
    this.socket.emit('ride_status_change', data);


  }
  driversResponseEmit(data: any) {
    this.socket.emit('driver_response', data);


  }
  driversResponseOn() {
    return new Observable<any>(observer => {

      this.socket.on('driver_response', (data: any) => {
        observer.next(data);
      });
    });

  }

}
