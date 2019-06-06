import { Component, ViewChild,ViewChildren,QueryList} from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';

import {AccountPage} from '../account/account'

@IonicPage()
@Component({
  selector: 'page-add-record',
  templateUrl: 'add-record.html',
})
export class AddRecordPage {
  @ViewChild('recordName') recordName;
  @ViewChild('recordAmount') recordAmount;

  private groupDoc: AngularFirestoreDocument<Group>;
  group: Observable<Group>;
  walletMembersCollection: AngularFirestoreCollection<User>;
  private recDoc: AngularFirestoreDocument<WalletRecord>;
  walletUsers: Observable<User[]>;
  isLoaded:boolean = false;
  docId:string;

  // BUYER
  @ViewChildren('buyerAmountInput') buyerAmountInput:QueryList<any>;
  @ViewChildren('buyerAmountCheck') buyerAmountCheck:QueryList<any>;
  isBuyerArr:boolean[] = new Array();
  buyerAmount:number[] = new Array();
  finalBuyerList:any = new Array();
  showBuyer:boolean = true;
  buyerCounter:number = 0;

  // PAYER
  @ViewChildren('payerAmountCheck') payerAmountCheck:QueryList<any>;
  @ViewChildren('payerAmountInput') payerAmountInput:QueryList<any>;
  isPayerArr:boolean[] = new Array();
  payerAmount:number[] = new Array();
  finalPayerList:any = new Array();
  showPayer:boolean = true;
  payerCounter:number = 0;


  
  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.groupDoc = afs.doc('wallets/'+navParams.get("groupId"));
    this.group = this.groupDoc.valueChanges();
    this.walletMembersCollection = afs.collection<Group>('wallets').doc(navParams.get("groupId")).collection('wallet_members');
    
    if(navParams.get("recID")){
      this.isLoaded=true;
      this.docId = navParams.get("recID");
      this.recDoc = afs.collection<Group>('wallets').doc(navParams.get("groupId")).collection('wallet_records').doc(navParams.get("recID"));

    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRecordPage');
    
    this.initializeNewRecord();
  }

  initializeNewRecord(){
    this.walletUsers = this.walletMembersCollection.snapshotChanges().map(actions => {
      this.finalBuyerList = new Array();
      this.finalPayerList = new Array();
      let ret = actions.map(a=>{
        //initialize BUYER
        this.finalBuyerList.push({
          isBuyer:false,
          memberId:a.payload.doc.id,
          memberName:a.payload.doc.data().name,
          amount:0,
          fixed:false
        });
        //initialize PAYER
        this.finalPayerList.push({
          isPayer:true,
          memberId:a.payload.doc.id,
          memberName:a.payload.doc.data().name,
          amount:0,
          fixed:false
        });

        return {
          id:a.payload.doc.id,
          name:a.payload.doc.data().name,
          email:a.payload.doc.data().email,
          avatar:a.payload.doc.data().avatar,
          createDate:a.payload.doc.data().createDate,
          money:a.payload.doc.data().money,
          pays:false
        }
      });
      this.payerCounter = 0;
      this.finalPayerList.forEach(element => {
        if(element.isPayer)this.payerCounter++;
      });
      if(this.isLoaded){
        this.loadExistingRecord();
      }
      return ret;
    })
  }


  loadExistingRecord(){
    this.recDoc.snapshotChanges().subscribe(rec=>{
      
      this.recordAmount.value = rec.payload.data().amount;
      this.recordName.value = rec.payload.data().name;
      //initialize BUYER
      this.buyerCounter = 0;
      rec.payload.data().buyer.map(bu=>{
        var fBuyer = this.finalBuyerList.find(buListItem=>{
          if(buListItem.memberId === bu["memberId"]){
            this.buyerCounter++;
            return true
          }else{return false}
        });
        fBuyer.isBuyer = true;
        fBuyer.fixed = true;
        console.log("test: ",fBuyer);
        fBuyer.amount = bu["amount"];
        fBuyer.fixed = bu["fixed"];
        this.buyerAmountInput.map((bu,i)=>{bu.value = this.finalBuyerList[i].amount})
      });
      //initialize PAYER
      this.payerCounter = 0;
      rec.payload.data().payer.map(pa=>{
        var fPayer = this.finalPayerList.find(paListItem=>{
          if(paListItem.memberId === pa["memberId"]){
            this.payerCounter++;
            return true
          }else{return false}
        });
        fPayer.isPayer = true;
        fPayer.fixed = true;
        console.log("test: ",fPayer);
        fPayer.amount = pa["amount"];
        fPayer.fixed = pa["fixed"];
        this.payerAmountInput.map((pa,i)=>{pa.value = this.finalPayerList[i].amount})
      });
    });
  }

// BUYER FUNCTIONS

getFixedBuyerAmount(){
    let buyerAmIn = this.buyerAmountInput.toArray().map(bu=> parseFloat(bu.value));
    var fixCost = this.finalBuyerList.reduce((sum,bu,i)=>{
      if(bu.fixed && bu.isBuyer) return sum + buyerAmIn[i];
      else return sum
    },0);
    return fixCost;
  }

  getFixedBuyerCount(){
    var buyerCount = 0;
    this.finalBuyerList.forEach(element => {
      if(element.fixed&& element.isBuyer)buyerCount++
    });
    return buyerCount;
  }

  buyerAmountChange(memberIndex:any){
    this.finalBuyerList[memberIndex].fixed=true;
    this.refrechBuyerAmount(memberIndex);
  }

  lockBuyer(memberIndex:any){
    this.finalBuyerList[memberIndex].fixed=!this.finalBuyerList[memberIndex].fixed;
    this.refrechBuyerAmount(memberIndex);
  }

  refrechBuyerAmount(memberIndex?:number){
    this.buyerAmountInput.map((pa,i)=>{
      if(this.finalBuyerList[i].isBuyer){
        if(!this.finalBuyerList[i].fixed){
          pa.value = (this.recordAmount.value-this.getFixedBuyerAmount())/(this.buyerCounter-this.getFixedBuyerCount());
        }
        this.finalBuyerList[i].amount = pa.value;
        
      }else{
        pa.value = 0;
      }
    });
  }

  activateBuyer(buyerId:number,index:number){
    this.finalBuyerList[index].isBuyer = !this.finalBuyerList[index].isBuyer;
    if(this.finalBuyerList[index].isBuyer){
      this.buyerCounter++;
    }else{
      this.buyerCounter--;
      this.finalBuyerList[index].fixed=false;
    }
    this.refrechBuyerAmount();
  };

  checkIfBuyer(memberIndex:number){
    return this.finalBuyerList[memberIndex].isBuyer;
  }

  getFinalBuyerNameList(){
    return this.finalBuyerList.filter(bu=>{return bu.isBuyer});
  }

  // PYER FUNCTIONS
  getFixedPayerAmount(){
    let payerAmIn = this.payerAmountInput.toArray().map(pa=> parseFloat(pa.value));
    var fixCost = this.finalPayerList.reduce((sum,pa,i)=>{
      if(pa.fixed && pa.isPayer) return sum + payerAmIn[i];
      else return sum
    },0);
    return fixCost;
  }

  getFixedPayerCount(){
    var fixCost = 0;
    this.finalPayerList.forEach(element => {
      if(element.fixed&& element.isPayer)fixCost++
    });
    return fixCost;
  }

  payerAmountChange(memberIndex:any){
    this.finalPayerList[memberIndex].fixed=true;
    this.refrechPayerAmount(memberIndex);
  }

  lockPayer(memberIndex:any){
    this.finalPayerList[memberIndex].fixed=!this.finalPayerList[memberIndex].fixed;
    this.refrechPayerAmount(memberIndex);
  }

  refrechPayerAmount(memberIndex?:number){
    this.payerAmountInput.map((pa,i)=>{
      if(this.finalPayerList[i].isPayer){
        if(!this.finalPayerList[i].fixed){
          pa.value = (this.recordAmount.value-this.getFixedPayerAmount())/(this.payerCounter-this.getFixedPayerCount());
        }
        this.finalPayerList[i].amount = pa.value;
        
      }else{
        pa.value = 0;
      }
    });
  }

  activatePayer(payerId:number,index:number){
    this.finalPayerList[index].isPayer = !this.finalPayerList[index].isPayer;
    if(this.finalPayerList[index].isPayer){
      this.payerCounter++;
    }else{
      this.payerCounter--;
      this.finalPayerList[index].fixed=false;
    }
    
    this.refrechPayerAmount();
  };

  checkIfPayer(memberIndex:number){
    return this.finalPayerList[memberIndex].isPayer;
  }

  getFinalPayerNameList(){
    return this.finalPayerList.filter(bu=>{return bu.isPayer});
  }

  // RECORD FUNCTIONS
  recordAmountChange(){
    this.refrechPayerAmount();
    this.refrechBuyerAmount();
  }

  addRecord(){
    console.log(this.isPayerArr);
    this.groupDoc.ref.get().then(grp=>{
      var buyers = new Array();
      for(var i:number = 0;i<this.finalBuyerList.length;i++) {
        if(this.finalBuyerList[i].isBuyer) {
          buyers.push({
            "memberId":this.finalBuyerList[i].memberId,
            "amount":this.finalBuyerList[i].amount,
            "fixed":this.finalBuyerList[i].fixed
          });
        }
      }

      var payers = new Array();
      for(i = 0;i<this.finalPayerList.length;i++) {
        if(this.finalPayerList[i].isPayer) {
          payers.push({
            "memberId":this.finalPayerList[i].memberId,
            "amount":this.finalPayerList[i].amount,
            "fixed":this.finalPayerList[i].fixed
          });
        }
      } 

      console.log("paypay",payers);
      var rec:WalletRecord = {
        name:this.recordName.value,
        date:new Date().toLocaleString(),
        amount:this.recordAmount.value,
        payer:payers,
        buyer:buyers
      }
      if(!this.isLoaded){
        this.docId = new Date().getTime().toString();
      }
      this.groupDoc.collection('wallet_records').doc(this.docId).set(rec)
        .then(_ =>this.navCtrl.pop());
    });
  }
}
