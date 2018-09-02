import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AddRecordPage } from '../add-record/add-record';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  groupId:string;
  groupsCollection: AngularFirestoreCollection<Group>;
  group: Observable<Group>;
  private groupDoc: AngularFirestoreDocument<Group>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore,public afAuth: AngularFireAuth) {
    this.groupId = navParams.get("groupId");
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.groupDoc = afs.doc<Group>('wallets/'+navParams.get("groupId"));
        this.group = this.groupDoc.valueChanges();
        console.log("Group: ",this.group);
      } else {
        console.log('user not logged in');
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
    console.log(this.group);
  }

  addBill(){
    this.navCtrl.push(AddRecordPage,{
      groupId:this.groupId
    });
  }

}
