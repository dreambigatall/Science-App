const y=new Set([1,2,1,3,1,2,4]);
console.log(y);
/*constat*/
const LB_Per_KG=2.2;
const MILLI_Per_second=1000;
const Second_per_minut=60;
const Second_per_hour=3600;
//class section to refactor the belloe code

class Expirement{
    #id;
    #task;
    #budget;
    #startTime;
    #endTime;
    #complete;

    constructor(id,task,budget,startTime,endTime,complete){
        this.#id=id;
        this.#task=task;
        this.#budget=budget;
        this.#startTime=startTime;
        this.#endTime=endTime;
        this.#complete=complete;
    }

    
    static createCompleteExpirement(id,task,budget ,starTime , endTime){
        return new Expirement(id, task, budget, starTime, endTime=true);
    }

    static createOngoingExpirement(id, task, budget , starTime){
        return new Expirement(id, task, budget, starTime, null, false);
    }
    toString(){
        let result="Expirement " +this.#id+" \" "+this.#task+"\" ";
        result += "Buget: " +formatCurrency(this.#budget) +" ";
        result +=this.#startTime.toLocaleString("en-GB",
            
        {timeZone: 'Europe/London'})+ " ";
        result +=(this.#complete)? this.#endTime.toLocaleString("en-GB",
        {timeZone: 'Europe/London'}) : " on going";
        return result;

    }

    get id(){
        return this.#id;
    }
    get task(){
        return this.#task;
    }

    get budget(){
        return this.#budget;
    }
    get starTime(){
        return this.#startTime;
    }
    get endTime(){
        return this.endTime;
    }
    get complete(){
        return this.#complete;
    }

    set complete(endTime){
        this.#endTime=endTime;
        this.#complete=true;
    }

    getMesurements(){
        return Array.from(data.getMesurements(this.id))
    }
    addMesurement(unit, value){

        let duretion=formatduretion(new Date().getTime() - this.#startTime.getTime());

        let numvalue = parseFloat(value);
        if(isNaN(numvalue)){
            throw "Mesurement value"+ value +"is not a number";
        }

        data.addMesurement(this.#id, new Mesurement(unit, value, duretion));
    }

}

class Mesurement{
    #id;
    #unit;
    #value;
    #time;

    static #units = ["s", "m", "kg", "A", "K" , "mol" , "cd"];
    static #maxId=0;

    constructor(unit , value, time){
        this.#id=++Mesurement.#maxId;
        this.#unit=(Mesurement.#units.indexOf(unit) == -1) ? null : unit;
        this.#value=value;
        this.#time=time; 
    }

    toString(){
        let result=`Mesurement ${this.#id} , ${this.#unit} , ${this.#value} , ${this.#time}`;
        return result;

    }
    get id(){
        return this.#id;
    }
    get unit(){
        return this.#unit;

    }
    get value(){
        return this.#value
    }

    get time(){
        return this.#time;
    }

}

class ThroughExpirement extends Expirement{
    #thoughts=[];

    constructor (id, task, thought,starTime,endTime, complete){
        super(id , task, 0, starTime, endTime, complete);
        this.#thoughts[0]=thought;
    }

    get thought(){
        return this.#thoughts;
    }
    set thought(thought){
        this.#thoughts.push(thought);
    }
//overiding the toString method of the parent
    toString(){
        let result=super.toString() + "\nThoughts:";
        for(const thought of this.#thoughts){
            result+= "\n - " + thought;
        }
        return result;
    }
}


// Expirement.prototype.getMesurements=function(){
//     return Array.from(data.getMesurements(this.id));
// }


////
 /*-----object section for the class___----*/

 const data={
    allData : new Map(),

    expirements: new Map(),

    mesurements : new Map(),

    getExperiment(eId){
        return this.expirements.get(eId);
    },

    getMesurement(mId){
        return this.mesurements.get(mId);
    },

    getMesurements(eId){
        return this.allData.get(this.getExperiment(eId));
    },

    findExprimant(eId){
        let expirement=this.getExperiment(eId);
        return new Promise((resolve, rejected)=>{
            if(expirement != undefined){
                resolve(expirement)
            } else {
                rejected("Expirement with id"+ eId +" not found")
            }
        })
    },

   addExprimant(expirement){
       this.expirements.set(expirement.id, expirement);
       this.allData.set(expirement, new Set());
   },

   addMesurement(eId, mesurement){
    this.mesurements.set(mesurement.id,mesurement);
    this.allData.get(this.getExperiment(eId)).add(mesurement);
   }


 }
 /////





//initalization of Expirement object
let expirement1= Expirement.createOngoingExpirement(101, "Mesure Weight", 123.45, new Date(2022, 3, 16, 6, 7));
let expirement2=Expirement.createCompleteExpirement(102, "mesure Length", 321.54 , new Date(2022, 2, 1, 14, 30), new Date(2022, 4, 2, 21, 12));

//initatinate of mesurement object(class)

let mesurement1=new Mesurement("kg", 42, 'PT2M12S');
let mesurement2=new Mesurement("kg", 40, 'PT3M10S');
let mesurement3=new Mesurement("kg", 3, 'PT3M55S');
let mesurement4=new Mesurement("m", 12, 'PT20M');
let mesurement5=new Mesurement("m", 10, 'PT1H22M10S');

//Add expirements and mesurement to data object
data.addExprimant(expirement1);
data.addExprimant(expirement2);
data.addMesurement(expirement1.id, mesurement1);
data.addMesurement(expirement1.id, mesurement2);
data.addMesurement(expirement1.id, mesurement3);
data.addMesurement(expirement2.id , mesurement4);
data.addMesurement(expirement2.id , mesurement5);



//let mesurements=Array.from(data.getMesurements(101));
let mesurements=data.getExperiment(101).getMesurements();

 //let mesurements=[mesurement1,mesurement2,mesurement3];


 function lb2kg(lb){
    return lb/LB_Per_KG;
 }

  function kg2lb(kg){
     return kg*LB_Per_KG;
  }



//mili second converter
function parseDuretion(duretion){
    let duretionPattern=/PT(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;//this is regulur expresion
    
    let matches= duretion.match(duretionPattern);//match() is used tofind the duretion similar with the duretionPattern and it is true it eturn array
    
    let hour=(matches[1]=== undefined)?0:matches[1];
    let minute=(matches[2]=== undefined)?0:matches[2];
    let second=(matches[3]=== undefined)?0:matches[3];
    return (parseInt(hour)*Second_per_hour*
    parseInt(minute)*Second_per_minut*
    parseInt(second))*MILLI_Per_second;
}
 

//format duetion in milisecond  in to iso standard
 function formatduretion(duretion){
    if(duretion==0){
        return "PTOS";
    }
    let totalSecond=Math.trunc(duretion/MILLI_Per_second);
    let hour=Math.trunc(totalSecond/Second_per_hour);
    let minute=Math.trunc((totalSecond%Second_per_hour)/Second_per_minut)
    let second=Math.trunc(totalSecond % Second_per_minut)
    let result="PT";
    if(hour != 0){
        result+=hour+'H';
    }
    if(minute !=0){
        result+=minute+'M';
    }
    if(second != 0){
        result+=second+"S";
    }
    return result;
 }


 function commpareMesurement(m1,m2){
    let result=0;
     if(m1.value < m2.value){
        result=-1;
    }
    else{
        if(m1.value==m2.value){
            result=0
        }
        else{
            result=1;
        }
    } 
    return result;
 }
function claculetAverageMesurement(mesurements){
    let result=0;
    for(const  mesurement of mesurements){
        result+=parseFloat(mesurement.value);

    }
    result=(result/mesurements.length).toFixed(2);
    return result;
}
 
function claculetAverageMesurements(mesurements){
    let result={
        kgTotal:0.0,
        kgValue:0,
        mTotal:0.0,
        mValue:0
    };
    for(const mesurement of mesurements){
        switch(mesurement.unit){
            case 'kg':
                result.kgTotal+=parseFloat(mesurement.value);
                result.kgValue++;
            break;
            case 'm':
                result.mTotal+=parseFloat(mesurement.value);
                result.mValue++;
                break;
        }
    }
    result.kgTotal=(result.kgTotal/result.kgValue).toFixed(2);
    result.mTotal=(result.mTotal/result.mValue).toFixed(2);
    return result;

}

//format currency
function formatCurrency(value){
    const format=new Intl.NumberFormat('en-GB',
    {style: 'currency', currency :'GBP', minimumFractionDigits:0, maximumFractionDigits:2})
    return format.format(value);
}

export  {data, claculetAverageMesurement, formatCurrency}