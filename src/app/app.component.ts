import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from 'angularfire2/firestore'
import {Observable}from 'rxjs/Observable';
import 'rxjs/add/operator/map';


import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

interface Note{
  name: string;
  id?:string;
}
declare global {
  interface Group{
    id?:string;
    name: string;
    admins_refs: String[];
    members_refs?: String[];
    members?:User[];
    records?: WalletRecord[];
  }

  interface User{
    id?:string;
    name: string;
    email:string;
    createDate?: string;
    avatar?:string;
    money?:number;
    pays?:boolean;
    paysAmount?:number;
    fixed?:boolean;
  }
  
  interface WalletRecord{
    id?:string;
    name: string;
    description?: string;
    date: string;
    amount:number;
    payer?:object[];
    buyer?:object[];
  }
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;

  notesCollection: AngularFirestoreCollection<Note>;
  public notes: Observable<Note[]>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private afs:AngularFirestore) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    // this.notesCollection = this.afs.collection('wallets')
    // this.notes = this.notesCollection.valueChanges()
    // console.log(this.notes,this.notesCollection)
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


}
