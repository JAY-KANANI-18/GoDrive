import { Injectable } from '@angular/core';
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
    });
  }
  ongo() {

    this.socket.on('message', (data) => {
    });


  }
  fromAdminassign(data: any) {
    this.socket.emit('request-select-assign', data);


  }
  toDriver() {
    this.socket.on('toDriver', (data:any) => {
      console.log(data);
      this.rideData = data




    });


  }


}
