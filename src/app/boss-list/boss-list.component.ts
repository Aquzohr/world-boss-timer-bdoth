import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs';
import { DELEGATE_CTOR } from '@angular/core/src/reflection/reflection_capabilities';

@Component({
  selector: 'boss-list',
  templateUrl: './boss-list.component.html',
  styleUrls: ['./boss-list.component.css']
})

export class BossListComponent implements OnInit {

  constructor(private db: AngularFireDatabase) { }

  listBoss = [];
  isLoading = true;

  showDay(day){
    switch(day){
      case 0:
      return "Sunday";
      case 1:
      return "Monday";
      case 2:
      return "Tuesday";
      case 3:
      return "Wednesday";
      case 4:
      return "Thursday";
      case 5:
      return "Friday";
      case 6:
      return "Saturday";
    }
  }

  bossTimer(bosstime,bossday){

    //for boss
    var curr_day=new Date().getDay();
    var boss_time = bosstime*60*60;

    //midnight 0:00
    if(bossday==0 && curr_day != 0){
      bossday = 7;
    }

    if(bossday > curr_day){
      boss_time += (bossday-curr_day)*24*60*60;
    }
  
    //curent
    var hour=new Date().getHours();
    var min= new Date().getMinutes();
    var sec= new Date().getSeconds();
  
    var current_time = (hour*60*60) + (min*60) + sec;
  
    return boss_time-current_time;
  }

  conditionDay(day){
    if(day==7){
      return 0;
    }
    return day;
  }

  findBossNextSpawn(data){
    var curr_day=new Date().getDay();
    var hour=new Date().getHours();

    var i = 0;
    do{
      for (var key in data) {
        if(data[key].day==this.conditionDay(curr_day+i)){
          //console.log(i + ": " + data[key].name + ' |DAY: ' + data[key].day+ ' |TIME: ' + data[key].time);
          if(this.listBoss.length == 5){
            break;
          }

          if(i==0 && hour < data[key].time){
            this.listBoss.push({
              name: data[key].name,
              time: data[key].time,
              day: data[key].day
            });
          }
          
          if(i!=0){
            this.listBoss.push({
              name: data[key].name,
              time: data[key].time,
              day: data[key].day
            });
          }
        }
      }
      i++;
    }while(this.listBoss.length < 5);
  
  };

  ngOnInit() {
    this.getBoss('/world_boss').subscribe(
      (response) => {
        this.findBossNextSpawn(response);
        this.isLoading = response.some(x => x.time == 0) ? false : true;
      }
    );


  }

  getBoss(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

}
