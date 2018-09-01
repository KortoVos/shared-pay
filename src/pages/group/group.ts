import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from 'angularfire2/firestore'
import {Observable}from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import { AddMemberPage } from '../add-member/add-member';


/**
 * Generated class for the GroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
interface Group{
  id?:string;
  name: string;
  admin: string;
  member?: Member[];
}

interface Member{
  name: string;
  joinDate: string;
  avatar?:string;
}

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {
  groupId:string;
  groupsCollection: AngularFirestoreCollection<Group>;
  group: Observable<Group>;
  private groupDoc: AngularFirestoreDocument<Group>;
  memberList: Member;
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
    console.log('ionViewDidLoad GroupPage');
  }

  addMember(){
    this.navCtrl.push(AddMemberPage,{
      groupId:this.groupId
    });
        
/* this.groupDoc.ref.get().then(grp=>{
      console.log("try update")
      const da:string = ""+Date.now();
      var memberList: Member[] = grp.data().member;
      if(memberList.length==0){ memberList=[] }
      memberList.push({name:"peter",joinDate:da});
      
      this.groupDoc.update({member:memberList}).then(_ => console.log('update!'));
    });*/
  }

}
