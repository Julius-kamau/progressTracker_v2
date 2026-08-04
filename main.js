
const getEls = (className) => document.getElementsByClassName(className);
const getEl = (id) => document.getElementById(id);
const createEl = (tagName) => document.createElement(tagName);
const updateGraph = getEl("updateGraph");
const calcHolder = getEl('calcHolder');
const ToDoHolder = getEl('myToDoList');
let userData,theGraph,graphTitle;


//BAR GRAPH FUNCTIONS
function graphUpdate(graph,position,action){
   if(action){
      const updateVal = getEl('graphUpdateInput').value;
      let newGraphHeight = updateVal;
      //newGraphHeight = newGraphHeight/goal....newGraphHeight =newGraphHeight * 100;
      let goal = userData[4][graphTitle];
      newGraphHeight = newGraphHeight/goal;
      newGraphHeight = newGraphHeight*100;
      updateUserData(0,graphTitle,updateVal);
      updateGraphHeight(theGraph,newGraphHeight);
      hidePopUp("updateGraph");
      return;
   }
   theGraph = getEl(graph);
   graphTitle = theGraph.innerText;
   let lastInptVal = userData[0][graphTitle];
   getEl('graphTittle').innerText = graphTitle;
   getEl('graphText').innerText = graphTitle.replace('ing', '');
   showPopUp("updateGraph", "grid");
   updateGraph.style.marginLeft = position;
   getEl('graphUpdateInput').value = lastInptVal;
   getEl('graphUpdateInput').focus();
}

function updateGraphHeight(theGraph,updateVal){
   //////alert("working"+ updateVal + theGraph);
   theGraph.style.height = parseInt(updateVal)+"%";
}

//GENERAL POP UP FUNCTIONS
function showPopUp(elId,display){
   el = getEl(elId);
   el.style.display = display;
}
function hidePopUp(elId){
   el = getEl(elId);
   el.style.display = "none";
}

//CLACULATOR FUNCTIONS
const calcInput = getEl('calcInput');
const calcAnswer = getEl('calcAnswer');

function typeIn(num){
   //////alert(num);
   calcInput.innerText = calcInput.innerText.concat("", num);
}
function clearCalc(){
   //////alert('clearing');
   calcInput.innerText = "";
}

function parseOperation(){
   const str = calcInput.innerText;
   let operations = ['+','-','/','x'];
   let problem = [];
   let laststop = 0;
   for(let i=0; i<=str.length-1; i++){
      let isOp = operations.includes(str[i]);
      if(isOp){
         currNum = str.slice(laststop, i);
         problem.push(currNum);
         problem.push(str[i]);
         laststop = i;
      }
      if(i===str.length-1) problem.push(str.slice(laststop+1, i+1));
      continue;
   }
   //////alert("finito" + problem);
   solveProblem(problem);
}
function solveProblem(problem){
   let numA,numB,operation,product;
   for(let i=0; i<problem.length; i+=2){
      if(i===0){
         numA = parseFloat(problem[i]);
      } else {
         numA = product;
      }
      numB = parseFloat(problem[i+2]);
      operation = problem[i+1];
      //////alert(numA+typeof(numA)+" "+typeof(numB));
      if(operation==="+"){
         product = numA + numB;
      }
      else if(operation==="-"){
         product = numA - numB;
      }
      else if(operation==="/"){
         product = numA/numB;
      }
      else if(operation==="x"){
         product = numA*numB;
      }
   }
   calcAnswer.innerText = product;
   getEl('graphUpdateInput').value = product;
}


//DAILY PROGRESS GRAPH FUNCTIONS
function getGrahValsAsArray(){ 
   let graphVals = objToArr(userData[0],true,true);
   //////alert("array graphVals are: "+JSON.stringify(graphVals));
   return graphVals;
}
function averageOut(graphVals) {
   //percVal/100*holderHeight = valInpx;  percVal = valInpx*100/holderHeght
   const graphHolder = getEl('graphsHolder');
   const isConstructiveLi = userData[5];
   const holderHeight = parseFloat(window.getComputedStyle(graphHolder).height.replace("px", ""));
   const ratio = 100/holderHeight;
   let sum = 0;
   for(let i=0; i<=graphVals.length-1; i++){
      let currVal = graphVals[i];
      let isConstructive = isConstructiveLi[i];
      currVal = currVal*ratio*isConstructive;
      sum+=currVal;
   }
   let average = sum/graphVals.length;
   return average;
}
function plotGraph(plottingVals){
   //[12,79,13,0,14,0....]
   ////alert('starting to plot '+JSON.stringify(plottingVals));
   if(plottingVals.length<1) return; 
   const progressGraphHolder =  getEl('progressGraphHolder');
   for(let i=0; i<=plottingVals.length-1; i+=2){
      ////alert('plotting date ' + plottingVals[i] + ' value ' + plottingVals[i+1]);
      const dot = document.createElement("tt");
      dot.classList.add('progressMarker');
      dot.id = plottingVals[i];
      dot.innerText = ".";
      dot.style.marginTop = plottingVals[i+1]*1.3 + "px";
      progressGraphHolder.appendChild(dot);
   }
}
function convertDailyProgressData(data,startingDate) {
   //[79,0,0,0...] => {14: 79, 15: 0, 16: 0, 17: 0...} ......simply generates 'date : overallScore' obj
   const isArray = Array.isArray(data);
   if(isArray) {
      const dataObj = {};
      for(let i = 0; i<=data.length-1; i++){
         dataObj[startingDate] = data[i];
         startingDate++;
      }
      return dataObj;
   }
   //{14: 79, 15: 0, 16: 0, 17: 0...} => [14,79,15,0,16,0,17,0...]
   else {
      const dataArr = Object.entries(data).flat().map(Number);
      return dataArr;
   }
}
function resetDailyProgressVals() {
   updateUserData(1,"null",{});
}


//TO DO LIST FUNCTIONS
function createToDoDummy(boolAttatchEVent){
   alert('awaiting reimplementation');
}
function createToDo(taskHolderEl,boolPushToUserData,boolAttacheEvent,boolAttatchDates) {
   alert('awaiting reimplementation');
}
function completeTask(taskholderEl){
   alert('awaiting reimplementation');
}
function deleteTask(taskHolderEl){
   const taskDates = taskHolderEl.querySelector('.taskDates');
   const currentObjDate = taskDates.children[0].innerText;
   const index = userData[2].findIndex(task => task.dateCreated === currentObjDate);
   ////alert('deleting task '+index);
   userData[2].splice(index, 1);
   updateUserData(2,'null',userData[2]);
   ////alert(JSON.stringify(userData[2]));
   //[{tittle: "study", details: "study for exam...", dateCreated: "....", deadline: "..."...},...]
   //userData[2].splice(index, 1)
   taskHolderEl.remove();
}
function createTaskObj(title,content,dateCreated,deadline,isComplete){
   alert('awaiting reimplementation');

}
function updateDeadlinesOnDb(daysPassed,hoursPassed,minsPassed){
   alert('awaiting reimplementation');
}
function updateToDosDeadline(boolUseSession = true){
   alert('awaiting reimplementation');
}
function loadTasks(){
   alert('awaiting reimplementation');
}


//GENERAL INITIALIZATION FUNCTIONS
function getTimePassed(dateA, dateB) {
   let timePassed,isNextDay;
   let currLoginDate,lastLoginDate;
   if(dateA && dateB) {
      currLoginDate = parseDateToDayHourMin(dateA); //2026-06-23T07:54:09.769Z => [06, 07, 54]
      lastLoginDate = parseDateToDayHourMin(dateB);
   } else {
      currLoginDate = parseDateToDayHourMin(userData[3]["currLogin"]);
      lastLoginDate = parseDateToDayHourMin(userData[3]["lastLogin"]);
   }
   timePassed = subtractTime(currLoginDate[0],currLoginDate[1],currLoginDate[2],lastLoginDate[0],lastLoginDate[1],lastLoginDate[2]);
   isNextDay = currLoginDate[0]-lastLoginDate[0];
   timePassed.push(isNextDay);
   console.log("days pssed are: "+timePassed[0]);
   console.log("time passed is "+JSON.stringify(timePassed));
   return timePassed; // [days,hours,minutes,isnextday]
}
function parseDateToDayHourMin(dateObj){
   const dateStr = JSON.stringify(dateObj);
   const day = dateStr.slice(9, 11);
   const time = dateStr.slice(12, 17);
   //alert("day is: "+day+"time is: "+time);
   const hour = time.substring(0,2);
   const min = time.substring(3);
   const dayHourMin = [parseInt(day), parseInt(hour), parseInt(min)];
   //alert(JSON.stringify(dayHourMin));
   return dayHourMin;
}
function convertTime(convertTo, timePassedArr){
   //alert("converting time.Time PassedArr is " + timePassedArr + typeof(timePassedArr[0]));
   if(convertTo == 'minutes'){
      //[days,hrs,mins]
      const multiplier = [1440,60,1];
      let timeInMinutes = 0;
      for(let i=0; i<=2; i++){
         const product = timePassedArr[i] * multiplier[i];
         timeInMinutes += product;
         //alert("product is "+product);
         //alert("time passed inn minutes is "+timeInMinutes);
      }
      return [0,0,timeInMinutes];
   } 
   else if(convertTo == 'hours'){
      const multiplier = [24,1,1/60];
      let timeInhours = 0;
      for(let i=0; i<=2; i++){
         const product = timePassedArr[i] * multiplier[i];
         timeInhours += product;
         //alert("time passed inn hours is "+timeInhours);
      }
      return [0,0,timeInhours];
   }
   else if(convertTo == 'days'){
      const multiplier = [1,1/24,1/1440];
      let timeIndays = 0;
      for(let i=0; i<=2; i++){
         const product = timePassedArr[i] * multiplier[i];
         timeIndays += product;
         //alert("time passed inn days is "+timeIndays);
      }
      return [0,0,timeIndays];
   }
}
function subtractTime(dayA, hourA, minA, dayB, hourB, minB) {
   const operandA = [dayA, hourA, minA];
   const operandB = [dayB, hourB, minB];
   const borrow = [0, 24, 60]; 
   const answer = [];
   for (let i = 2; i >= 0; i--) {
      if (operandA[i] < operandB[i] && i > 0) {
         operandA[i - 1] -= 1;
         operandA[i] += borrow[i];
      }
      const currAns = operandA[i] - operandB[i];
      answer.unshift(currAns/2);
   }
   return answer; // [days, hours, mins]
}
function resetGraphVals(){
   const defaultVals = userData[0];
   for (let key in defaultVals) defaultVals[key] = 0;
   updateUserData(0,"null",defaultVals);
}
function adjustGraphIds(graphValObj){
   ////alert("changing ids");
   let myArr = Object.entries(graphValObj).flat();
   let margins = ['20vw','35vw','55vw','0vw','20vw','30vw'];
   const graphs = getEls('barGraph');
   for(let i=0; i<=graphs.length-1; i++){
      graphs[i].id = myArr[i*2];
      graphs[i].innerText = myArr[i*2];
      graphs[i].addEventListener('click', ()=> {graphUpdate(myArr[i*2], margins[i])});
      //////alert(graphs[i].innerText + " graphId " + graphs[i].id);
   }
}

//USER DATA FUNCTIONS 
function updateUserData(index,objectKey,value,subjectKey){
   //userData = [{earning: 0,saving: 0...}, {20th: 40%, 25th: 70%,...}, [{tittle: "study", details: "study for exam...", dateCreated: "....", deadline: "..."...},...], {name: "...", lastLogin: "...", currLogin: "..."}]
   //SIMPLY - userData = [{graphs},{dailyavrgProgress},[toDos],{userInfo}]
   if(index == null) {
      //alert("updating all data");
   }
   else if(subjectKey && objectKey) {
      ////alert("editing to do"+JSON.stringify(value));
      userData[index][objectKey][subjectKey] = value;
   }
   else if(objectKey === "null"){
       userData[index] = value;
      if(index == 4){
         adjustGraphIds(value);
      }
   }
   else if(subjectKey === undefined && objectKey !== undefined && objectKey !== null){
      userData[index][objectKey] = value;
   }
   else {
      ////alert('pushing to do '+JSON.stringify(value));
      userData[index].push(value);
   }
   localStorage.setItem("userData", JSON.stringify(userData));
   let dataCopy = localStorage.getItem("userData");
   //alert(" data copy: "+dataCopy);
}
function createUserData() {
   ////alert("no data found creating new");
   const date = new Date();
      userData = [
                  {earning: 15,saving: 15,coding: 15,drawing: 15,others: 15,sleep: 15},
                  {},
                  [],
                  {name: "John Doe", lastLogin: date, currLogin: date, lastSeen: date, currSession: date},
                  {earning: 100,saving: 100,coding: 100,drawing: 100,others: 100,sleep: 100},
                  [1,1,1,1,1,1]
               ];
   localStorage.setItem("userData", JSON.stringify(userData));
}
function updateCurrentSession(){
   const newCurrSession = new Date();
   const newLastSeen = userData[3]['currSession'];
   updateUserData(3, 'lastSeen', newLastSeen);
   ////alert("UPDATED SESSSION "+JSON.stringify(userData[3]));
   updateUserData(3, 'currSession', newCurrSession);
}
function objToArr(data,boolFlattenIt,boolRemoveVals,keys_0_Vals_1){
   //{...} => [...] or [[a,b],[a,c],...]
   let arr = Object.entries(data);
   if(boolRemoveVals) {
      for(let i = 0; i<=arr.length-1; i++) arr[i].splice(keys_0_Vals_1, 1);
   }
   if(boolFlattenIt) arr = arr.flat();
   return arr;
}

//CHANGING BENCHMARKS functions
function updateFormVals(trackableId){
  const trackables = getEls(trackableId);
  const trackable = getEl(trackableId);
  for (let i = 0; i<=trackables.length-1; i++){
   trackables[i].innerText = trackable.value;
  }
}
function finishSetBenchmarks() {
   ////alert("finishing.");
   const trackableA = getEl('trackableA').value;
   const trackableB = getEl('trackableB').value;
   const trackableC = getEl('trackableC').value;
   const trackableD = getEl('trackableD').value;
   const trackableE = getEl('trackableE').value;
   const trackableF = getEl('trackableF').value;
   const graphVals = getGrahValsAsArray(); 
   const selects = document.getElementsByTagName('select');
   const targets = getEls('target');
   const targetVals = [];
   const isConstructiveList = [];
   for(let i = 0; i<selects.length; i++){
      let selectsval = selects[i].value;
      let targetsVal = parseInt(targets[i].value);
      isConstructiveList.push(selectsval);
      targetVals.push(targetsVal);
   }
   const newGraphVals = {[trackableA]: graphVals[0], [trackableB]: graphVals[1], [trackableC]: graphVals[2], [trackableD]: graphVals[3], [trackableE]: graphVals[4], [trackableF]: graphVals[5],};
   const newTargetVals = {[trackableA]: targetVals[0], [trackableB]: targetVals[1], [trackableC]: targetVals[2], [trackableD]: targetVals[3], [trackableE]: targetVals[4], [trackableF]: targetVals[5]};
   //const newIsConstructiveList = {[trackableA]: isConstructiveList[0], [trackableB]: isConstructiveList[1], [trackableC]: isConstructiveList[2], [trackableD]: isConstructiveList[3], [trackableE]: isConstructiveList[4], [trackableF]: isConstructiveList[5]};
   updateUserData(0,"null",newGraphVals);
   updateUserData(4,"null",newTargetVals);
   updateUserData(5,"null",isConstructiveList);
   hidePopUp('setBenchmarksHolder');
}
function appendBenchmarks(){
   ////alert('appending benchmarks');
   const trackablesNames = objToArr(userData[0],true,true,1);
   const trackablesInpts = getEls('trackables');
   const goals = objToArr(userData[4],true,true);
   const goalsInpts = getEls('target');
   const isConstructiveLi = userData[5];
   const isConstructiveInpts = getEls('isConstructiveInpt');
   const isOk = trackablesNames.length + trackablesInpts.length + goals.length + goalsInpts.length + isConstructiveLi.length + isConstructiveInpts.length == 36;
   if(isOk) {
      for(let i=0; i<6; i++) {
        trackablesInpts[i].value = trackablesNames[i];
        goalsInpts[i].value = goals[i]; 
        isConstructiveInpts[i].value = isConstructiveLi[i];
      } 
   } else {
       alert("error while appending benchmarks"); 
   }
}


function updateSessionData(){
   updateCurrentSession();
   //updateToDosDeadline(true);
}
function setUp() {
   const date = new Date();
   userData = JSON.parse(localStorage.getItem("userData"));
   if(!userData) createUserData();
   let lastLoginDate = JSON.parse(localStorage.getItem("userData"))[3]["currLogin"];
   updateUserData(3,"lastLogin",lastLoginDate);
   updateUserData(3,"currLogin",date);
   const timePassedArr = getTimePassed(userData[3]['currLogin'], lastLoginDate);
   const daysPassed = timePassedArr[0];
   const isNextDay = timePassedArr[3];
   if(isNextDay && daysPassed < 29 && Math.sign(daysPassed)+1){
      const lastLoginDay = parseInt(JSON.stringify(lastLoginDate).slice(9,11));
      const isMultiDayAbsence = daysPassed>1;
      let graphVals = getGrahValsAsArray();
      let plottingVal = averageOut(graphVals);
      let plottings = [plottingVal];
      if(isMultiDayAbsence) plottings = new Array(daysPassed).fill(0);
      plottings[0] = plottingVal;
      plottings = convertDailyProgressData(plottings,lastLoginDay);
      plottings = {...userData[1], ...plottings};
      updateUserData(1,"null",plottings);
      resetGraphVals();
   } else if(daysPassed>28) {
      //alert("Your time and date might have changed abruptly,on to a FRESH START!");
      resetDailyProgressVals();
      resetGraphVals();
   }
   const graphVals = Object.entries(userData[0]);
   adjustGraphIds(userData[0]); //this doesnt just chahnge graph ids,it also attaches events to them -ugh!we'll fix the naming later
   appendBenchmarks();
   for(let i=0; i<graphVals.length; i++){ //this has to be a function
      const theGraph = graphVals[i][0];
      let newGraphHeight = graphVals[i][1];
      let goal = userData[4][theGraph];
      newGraphHeight = newGraphHeight/goal;
      newGraphHeight = newGraphHeight*100;
      getEl(theGraph).style.height = newGraphHeight + "%";
   }
   let plottingVals = userData[1];
   plottingVals = convertDailyProgressData(plottingVals);
   plotGraph(plottingVals);
   loadTasks();
}

//localStorage.clear();
setUp();
updateToDosDeadline(false);
setInterval(updateSessionData, 60000);
let myDateA = parseDateToDayHourMin(userData[3].currLogin);
let myDateB = parseDateToDayHourMin(userData[3].lastSeen);
let timeDifference = subtractTime(myDateA[0],myDateA[1],myDateA[2],myDateB[0],myDateB[1],myDateB[2]);
alert(myDateA + ' MY DATE B:  ' + myDateB + " TIME DIFFERNCE:  " + timeDifference);

/*
   JUST REBUILD TASKS FROM THE GROUND UP
*/