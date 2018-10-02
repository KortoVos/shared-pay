import { Component, ViewChild,ViewChildren,QueryList} from '@angular/core';
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
  @ViewChildren('payerAmountCheck') payerAmountCheck:QueryList<any>;
  @ViewChildren('payerAmountSlider') payerAmountSlider:QueryList<any>;
  @ViewChildren('payerAmountInput') payerAmountInput:QueryList<any>;
  private groupDoc: AngularFirestoreDocument<Group>;
  group: Observable<Group>;
  walletMembersCollection: AngularFirestoreCollection<User>;
  walletUsers: Observable<User[]>;
  isPayerArr:boolean[] = new Array();
  payerAmount:number[] = new Array();
  
  finalPayerList:any = new Array();
  showPayer:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.groupDoc = afs.doc('wallets/'+navParams.get("groupId"));
    this.group = this.groupDoc.valueChanges();
    this.walletMembersCollection = afs.collection<Group>('wallets').doc(navParams.get("groupId")).collection('wallet_members');
    this.walletUsers = this.walletMembersCollection.snapshotChanges().map(actions => {
      return actions.map(a=>{
        this.finalPayerList[a.payload.doc.id]={
          isPayer:false,
          memberId:a.payload.doc.id,
          amount:0
        };
        return {
          id:a.payload.doc.id,
          name:a.payload.doc.data().name,
          avatar:a.payload.doc.data().avatar,
          createDate:a.payload.doc.data().createDate,
          money:a.payload.doc.data().money,
          pays:false
        }
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRecordPage');
    
  }

  onChange(ev: any) {
    console.log('Changed', ev);
  }

  recordAmountChange(memberid:number){
    let ar = this.payerAmountCheck.toArray();
    //ar[0].nativeElement.value="";
    console.log(ar[0]);
    this.refrechPayerAmount(memberid);
  }

  payerAmountChange(memberid:any){
    console.log(memberid)
    this.refrechPayerAmount(memberid);
  }

  refrechPayerAmount(memberid:number){
    const payerAmountSlider = this.payerAmountSlider.toArray();
    this.payerAmountInput.map((pa,i)=>{
      pa.value = this.recordAmount.value * payerAmountSlider[i].value/100;
    });
    
  }

  activatePayer(payerId:number,index:number){
  //   for(var key in this.finalPayerList) {
  //     if(this.finalPayerList.hasOwnProperty(key)) {
  //       console.log(this.finalPayerList[key].isPayer)
  //     }
  // }
    this.finalPayerList[payerId].isPayer = !this.finalPayerList[payerId].isPayer;
    //this.finalPayerList.map(e=>{console.log(e)})
  };

  checkIfPayer(memberId:number){
    return this.finalPayerList[memberId].isPayer;
  }

  addRecord(){
    console.log(this.isPayerArr);
    this.groupDoc.ref.get().then(grp=>{
      //console.log(this.payer.value);
      var payers = new Array();
      var i:number = 0;
      for(var key in this.finalPayerList) {
        i++;
        if(this.finalPayerList.hasOwnProperty(key)&&this.finalPayerList[key].isPayer) {
          payers.push({"memberId":key,
            "amount":this.payerAmountInput[i].amount});
          
        }
      }
      console.log("paypay",payers);
      var rec:WalletRecord = {
        name:this.recordName.value,
        date:new Date().toLocaleString(),
        amount:this.recordAmount.value,
        payer:payers
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
