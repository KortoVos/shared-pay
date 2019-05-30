import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from '@angular/fire/auth';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('username') uname;
  @ViewChild('password') password;

  constructor(private fire: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  singInUser(){
    this.fire.auth.signInWithEmailAndPassword(this.uname.value,this.password.value)
    .then(data=>{
      console.log('got some data',data);
      this.navCtrl.setRoot(HomePage);
    })
    .catch(error=>{
      const alert = this.alertCtrl.create({
        title: 'Login Error',
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
    })

    
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

}
