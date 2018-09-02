import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.groupDoc = afs.doc<Group>('wallets/'+navParams.get("groupId"));
    this.group = this.groupDoc.valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRecordPage');
  }
  addRecord(){
    this.groupDoc.ref.get().then(grp=>{
      var recordList: WalletRecord[] = grp.data().records;
      if(!recordList){ recordList=[] }
      recordList.push({
        name:this.recordName.value,
        date:new Date().toLocaleString(),
        amount:this.recordAmount.value,
        payer:this.payer
      });
      
      this.groupDoc.update({records:recordList}).then(_ =>this.navCtrl.pop());
    });
  }
}
