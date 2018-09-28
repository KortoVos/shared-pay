import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-add-record',
  templateUrl: 'add-record.html',
})
export class AddRecordPage {
  @ViewChild('recordName') recordName;
  @ViewChild('recordAmount') recordAmount;
  @ViewChild('payer') payer;
  private groupDoc: AngularFirestoreDocument<Group>;
  group: Observable<Group>;
  walletMembersCollection: AngularFirestoreCollection<User>;
  walletUsers: Observable<User[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.groupDoc = afs.doc('wallets/'+navParams.get("groupId"));
    this.group = this.groupDoc.valueChanges();
    this.walletMembersCollection = afs.collection<Group>('wallets').doc(navParams.get("groupId")).collection('wallet_members');
    this.walletUsers = this.walletMembersCollection.snapshotChanges().map(actions => {
      return actions.map(a=>{
        return {
          id:a.payload.doc.id,
          name:a.payload.doc.data().name,
          avatar:a.payload.doc.data().avatar,
          createDate:a.payload.doc.data().createDate,
          money:a.payload.doc.data().money
        }
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRecordPage');
  }

  payerSelectChange(selectedValue: any) {
    var list = document.getElementById('autocomplete');
  }

  addRecord(){
    this.groupDoc.ref.get().then(grp=>{
      console.log(this.payer.value);
      var rec:WalletRecord = {
        name:this.recordName.value,
        date:new Date().toLocaleString(),
        amount:this.recordAmount.value,
        payer:this.payer
      }
      this.groupDoc.collection('wallet_records').doc(new Date().getTime().toString()).set(rec)
      // .then(
      //   this.payer.map(pa=>{
      //     console.log("pa: ",pa)
      //     this.groupDoc.collection('wallet_members').doc(pa).update({ money:this.recordAmount.value});
      //   }))
      .then(_ =>this.navCtrl.pop());
    });
  }
}
