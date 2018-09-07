import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { AngularFirestore,AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  @ViewChild('username') uname;
  @ViewChild('password') password;

  memberCollection: AngularFirestoreCollection<User>;
  memberDoc: AngularFirestoreDocument<User>;

  constructor(private fire: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,private afs: AngularFirestore) {
    this.memberCollection = this.afs.collection<User>('user');
  }

  ionViewDidLoad() {
    
  }

  registerUser(){
    this.fire.auth.createUserAndRetrieveDataWithEmailAndPassword(this.uname.value,this.password.value)
    .then(data=>{
      this.fire.auth.signInWithEmailAndPassword(this.uname.value,this.password.value)
      .then(data=>{
        const newUser: User = {
          name: data.user.email,
          email: data.user.email,
          createDate: new Date().toLocaleString(),
        }
        this.memberCollection.doc(data.user.uid).set(newUser).then(res=>{
          const alert = this.alertCtrl.create({
            title: 'Succsefull Registration',
            buttons: ['OK']
          });
          alert.present();
          this.navCtrl.setRoot(HomePage);
        });
      })
    }).catch(error =>{
      const alert = this.alertCtrl.create({
        title: 'Registration Error',
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
    });
  }

}
