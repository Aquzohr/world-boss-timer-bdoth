import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs';
import { DELEGATE_CTOR } from '@angular/core/src/reflection/reflection_capabilities';

@Component({
  selector: 'boss-list',
  templateUrl: './boss-list.component.html',
  styleUrls: ['./boss-list.component.css']
})

export class BossListComponent implements OnInit {

  bossObservable: Observable<any[]>;

  constructor(private db: AngularFireDatabase) { }

  hour = new Date().getHours();
  min = new Date().getMinutes();
  sec = new Date().getSeconds();

  day = new Date().getDay();
  nextDay = this.day+1;

  checkNextday(){
    if(this.nextDay==7){
      this.nextDay=0;
    }
  }

  leftTimeToday(boss_time){
    var time = boss_time*60*60;
    var current_time = (this.hour*60*60)+(this.min*60)+this.sec;

    return time - current_time;
  }

  leftTimeNextday(boss_time){
    var time = boss_time*60*60 + (24*60*60);
    var current_time = (this.hour*60*60)+(this.min*60)+this.sec;

    return time - current_time;
  }

  createJSON(){
    let k=0;
    let boss=["Kzarka", "Kutum"];

    var metadata = [];

    for(let i=1; i<8; i++){

      metadata.push(
        {
            "day": i,
            "time": "18:00",
            "name": boss[(i)%2]
        },
      );
    }

    return metadata;

  }

  ngOnInit() {
    this.bossObservable = this.getBoss('/world_boss');
    this.checkNextday();
  }

  getBoss(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

}
