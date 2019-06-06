import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import {TabsPage} from '../pages/tabs/tabs'
  import {GroupPage} from '../pages/group/group';
    import {AddMemberPage} from '../pages/add-member/add-member'
  import { AccountPage } from '../pages/account/account'
    import { AddRecordPage } from '../pages/add-record/add-record';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { environment} from './environment';

const firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    GroupPage,
    AddMemberPage,
    TabsPage,
    AccountPage,
    AddRecordPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: "bottom"} ),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    GroupPage,
    AddMemberPage,
    TabsPage,
    AccountPage,
    AddRecordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
