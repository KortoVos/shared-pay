import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AddRecordPage } from '../add-record/add-record';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  groupId:string;
  walletRecordsCollection: AngularFirestoreCollection<WalletRecord>;
  walletRecords: Observable<WalletRecord[]>;
  //private groupDoc: AngularFirestoreDocument<Group>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore,public afAuth: AngularFireAuth) {
    this.groupId = navParams.get("groupId");
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.walletRecordsCollection = afs.collection<Group>('wallets').doc(this.groupId).collection('wallet_records');
        this.walletRecords = this.walletRecordsCollection.snapshotChanges().map(actions => {
          return actions.map(a=>{
            return {
              name:a.payload.doc.data().name,
              amount:a.payload.doc.data().amount,
              date:a.payload.doc.data().date,
              payer:a.payload.doc.data().payer
            }
          })
        })
      } else {
        console.log('user not logged in');
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
    console.log(this.walletRecords);
  }

  addBill(){
    this.navCtrl.push(AddRecordPage,{
      groupId:this.groupId
    });
  }

  showRecord(recID:string){
    console.log(recID);
  }

}
