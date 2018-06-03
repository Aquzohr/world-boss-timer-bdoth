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

  time = new Date().getHours();
  min = new Date().getMinutes();
  sec = new Date().getSeconds();

  day = new Date().getDay();
  nextDay = this.day;

  dayClass = "";
  nextDayClass = "";

  addClassActive(){
    if(this.time < 18){
      this.dayClass = "active";
    }else{
      this.nextDayClass = "active";
    }

    //console.log(this.dayClass);
  }

  SetnextDay(time,boss_day){

    //console.log("BossDay"+boss_day);
    //console.log("nextDay"+this.nextDay);
    
    if(time==18 && boss_day == this.nextDay){
      this.nextDay+=1;
    }
  }

  leftTimeCal(boss_time,day,nextDay){
    var time = boss_time*60*60;
    var current_time = (this.time*60*60)+(this.min*60)+this.sec;

    if(day != nextDay){
      time += 24*60*60;
    }
    var total = time - current_time;

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
  }

  getBoss(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

}
