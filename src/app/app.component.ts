import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  ngOnInit() {
    firebase.initializeApp({
      apiKey: 'AIzaSyB4peIlVeEdtaKY3mxhL2GncmU7Y3kvxas',
      authDomain: 'httpangularudemy.firebaseapp.com',
    })
  }
}
