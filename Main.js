import {data, claculetAverageMesurement, formatCurrency}  from "./data_servise.js";

//////////ui section for event from ui///////////////

function findExpirement(event){
    event.preventDefault();
   
    let exp_id_field=document.getElementById('exp_id_field');

    let exp_task_field=document.getElementById('exp_task_field');
    let exp_budget_field=document.getElementById('exp_budget_field');
    let exp_startTime_field=document.getElementById('exp_startTime_field');
    let exp_endTime_field=document.getElementById('exp_endTime_field');
    let exp_complete_field=document.getElementById('exp_complete_field');
    let  mea_add_button=document.getElementById('mea_add_button');

   //find expirement
   let exp_id=parseInt(exp_id_field.value);
   //let expirement=data.getExperiment(exp_id);
   data.findExprimant(exp_id).then((expirement)=>{
     
    exp_task_field.value=expirement.task;
       exp_budget_field.value=formatCurrency(expirement.budget);
       exp_startTime_field.value=expirement.starTime.toISOString().slice(0,-1)//use to cut the last Z of js
       if(expirement.complete){
        exp_complete_field.checked=true;
        exp_endTime_field.value= expirement.endTime.toISOString.slice(0,-1);
        exp_complete_field.disabled=true;
        mea_add_button.disabled=true;
       }
       else{
        exp_complete_field.checked=false;
        exp_endTime_field.value="";
        exp_complete_field.disabled=false;
        mea_add_button.disabled=false;
       }
       displayMesurements(expirement);

   }).catch((error)=>{
      
       alert("Expirement with id " + exp_id + "not found");
       resetExpirementForm();
       resetMesurementsTabel();
   });

  
}


function displayMesurements(expirement){

    resetMesurementsTabel();
    let mesurements= expirement.getMesurements();
    let average= claculetAverageMesurement(mesurements);
    let max=Number.MIN_VALUE;
    let min=Number.MAX_VALUE;
    if(mesurements.length===0){
        average=0;
    }
    else{
        let mea_tabel=document.getElementById('mea_table');
        for(const mesurement of mesurements){
            max=Math.max(max, mesurement.value);
            min=Math.min(min, mesurement.value);
            let id_cell = document.createElement('td');
            id_cell.appendChild(document.createTextNode(mesurement.id));
            let unit_cell=document.createElement("td");
            unit_cell.appendChild(document.createTextNode(mesurement.unit));
            let value_cell=document.createElement("td");
            value_cell.appendChild(document.createTextNode(mesurement.value));
            let time_cell= document.createElement("td");
            time_cell.appendChild(document.createTextNode(mesurement.time));

            let mea_row=document.createElement("tr");
            mea_row.appendChild(id_cell);
            mea_row.appendChild(unit_cell);
            mea_row.appendChild(value_cell);
            mea_row.appendChild(time_cell);
            mea_tabel.appendChild(mea_row);
        }
        let averageRatio=((average-min)*100)/(max-min);
        // let exp_average_field=document.getElementById('exp_average_field');
        // exp_average_field.value=averageRatio;
        let exp_average_value= document.getElementById("exp_average_value");

        exp_average_value.style.width=averageRatio + '%';
        exp_average_value.innerText =average;
    }

}


function completeExpirement(event){

    let exp_id_field=document.getElementById('exp_id_field');
    let exp_complete_field=document.getElementById('exp_complete_field');
    let mea_add_button=document.getElementById('mea_add_button');
    let exp_id=parseInt(exp_id_field.value);
    let expirement=data.getExperiment(exp_id);
    let date=new Date();
    date.setMilliseconds(0);
    expirement.complete=date;

    exp_complete_field.checked=true;
    exp_endTime_field.value=expirement.endTime.toISOString().slice(0,-1);
    exp_complete_field.disabled=true;
    mea_add_button.disabled=true;

}



function showAddMesurementDialog(event){

    let mea_add_dialog=document.getElementById('mea_add_dialog');
    mea_add_dialog.showModal();

}


function addMesurement(event){
  event.preventDefault();
  let exp_id_field=document.getElementById("exp_id_field");
  let mea_unit_input=document.getElementById("mea_unit_input");
  let mea_value_input=document.getElementById('mea_value_input');
  let exp_id=parseInt(exp_id_field.value);
  let expirement=data.getExperiment(exp_id);
  

  try{
    expirement.addMesurement(mea_unit_input.value,mea_value_input.value);


  let mea_add_dialog=document.getElementById('mea_add_dialog');
  let mea_form=document.getElementById('mea');
  mea_form.reset();
  mea_add_dialog.close();

  } catch (error){
  alert(error)
  }
  displayMesurements(expirement);

}


function cancelAddMesurement(event){

    let mea_add_dialog=document.getElementById('mea_add_dialog');
    mea_add_dialog.close();

}


function resetMesurementsTabel(){
     let mea_tabel=document.getElementById('mea_table');
     while(mea_tabel.lastElementChild){
        mea_tabel.removeChild(mea_tabel.lastElementChild);
     }
}


function resetExpirementForm(){
    let exp_form=document.getElementById('exp');
    let mea_add_button=document.getElementById('mea_add_button');
   // let exp_average_field=document.getElementById("exp_average_field");
   let exp_average_value= document.getElementById("exp_average_value");
    exp_form.reset();
   // exp_average_field.value=0;
   exp_average_value.style.width="0%";
   exp_average_value.innerText="";
    mea_add_button.disabled=true;

}

 
window.addEventListener('load', (event)=>{
    let exp_find_button=document.getElementById('exp_find_button');
    let exp_complete_field=document.getElementById('exp_complete_field');
    let mea_add_button=document.getElementById('mea_add_button');
    let mea_ok_button=document.getElementById('mea_ok_button');


    let mea_reset_button=document.getElementById('mea_reset_button');
    let image=document.getElementsByClassName("img_slogan").item(0);
    setInterval(animateImage, 1000, image);
    exp_find_button.addEventListener('click', findExpirement);
    exp_complete_field.addEventListener('change', completeExpirement);
    mea_add_button.addEventListener('click', showAddMesurementDialog);
    mea_ok_button.addEventListener('click', addMesurement);
    mea_reset_button.addEventListener('click', cancelAddMesurement);

    
})

function animateImage(image){
    image.classList.toggle("grey");
}