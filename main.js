const getEls = (className) => document.getElementsByClassName(className);
const getEl = (id) => document.getElementById(id);
const createEl = (tagName) => document.createElement(tagName);
const updateGraph = getEl("updateGraph");
const calcHolder = getEl('calcHolder');
const ToDoHolder = getEl('myToDoList');
let userData, theGraph, graphTitle;

// BAR GRAPH FUNCTIONS
function graphUpdate(graph, position, action) {
    if (action) {
        const updateVal = parseFloat(getEl('graphUpdateInput').value) || 0;
        let goal = parseFloat(userData[4][graphTitle]) || 100;
        let newGraphHeight = (updateVal / goal) * 100;
        updateUserData(0, graphTitle, updateVal);
        updateGraphHeight(theGraph, newGraphHeight);
        hidePopUp("updateGraph");
        return;
    }
    theGraph = getEl(graph);
    graphTitle = theGraph.innerText;
    let lastInptVal = userData[0][graphTitle] || 0;
    getEl('graphTittle').innerText = graphTitle;
    getEl('graphText').innerText = graphTitle.replace('ing', '');
    showPopUp("updateGraph", "grid");
    if(updateGraph) updateGraph.style.marginLeft = position;
    getEl('graphUpdateInput').value = lastInptVal;
    getEl('graphUpdateInput').focus();
}

function updateGraphHeight(theGraph, updateVal) {
    if(theGraph) theGraph.style.height = parseFloat(updateVal) + "%";
}

// GENERAL POP UP FUNCTIONS
function showPopUp(elId, display) {
    let el = getEl(elId);
    if(el) el.style.display = display;
}
function hidePopUp(elId) {
    let el = getEl(elId);
    if(el) el.style.display = "none";
}

// CALCULATOR FUNCTIONS
const calcInput = getEl('calcInput');
const calcAnswer = getEl('calcAnswer');

function typeIn(num) {
    if(calcInput) calcInput.innerText = calcInput.innerText.concat("", num);
}

function clearCalc() {
    if(calcInput) calcInput.innerText = "";
    if(calcAnswer) calcAnswer.innerText = "";
}

function parseOperation() {
    if(!calcInput) return;
    const str = calcInput.innerText.replace(/\s/g, ''); 
    if(!str) return;
    let operations = ['+', '-', '/', 'x'];
    let problem = [];
    let laststop = 0;
    
    for (let i = 0; i < str.length; i++) {
        let isOp = operations.includes(str[i]);
        if (isOp) {
            problem.push(str.slice(laststop, i));
            problem.push(str[i]);
            laststop = i + 1; 
        }
    }
    problem.push(str.slice(laststop));
    solveProblem(problem);
}

function solveProblem(problem) {
    let product = parseFloat(problem[0]) || 0;
    
    for (let i = 1; i < problem.length; i += 2) {
        let operation = problem[i];
        let numB = parseFloat(problem[i + 1]);
        if (isNaN(numB)) continue;
        
        if (operation === "+") product += numB;
        else if (operation === "-") product -= numB;
        else if (operation === "/") product /= numB;
        else if (operation === "x") product *= numB;
    }
    
    if(calcAnswer) calcAnswer.innerText = product;
    const graphInput = getEl('graphUpdateInput');
    if(graphInput) graphInput.value = product;
}

// DAILY PROGRESS GRAPH FUNCTIONS
function getGrahValsAsArray() {
    let graphVals = objToArr(userData[0], true, true);
    return graphVals;
}

function averageOut(graphVals) {
    const graphHolder = getEl('graphsHolder');
    if (!graphHolder) return 0;
    const isConstructiveLi = userData[5];
    const goals = userData[4];
    const goalsMap = objToArr(userData[4],true,true,1);
    let sum = 0;
    
    for (let i = 0; i < graphVals.length; i++) {
        let currVal = parseFloat(graphVals[i]) || 0;
        let currValGoal = parseFloat(goals[goalsMap[i]]);
        let isConstructive = parseInt(isConstructiveLi[i]) || 0;
        sum += (currVal/currValGoal * 100 * isConstructive);
    }
    const average = sum/graphVals.length;
    alert('average is '+average);
    return graphVals.length ? (sum / graphVals.length) : 0;
}

function plotGraph(plottingVals) {
    if (!plottingVals || plottingVals.length < 1) return;
    const progressGraphHolder = getEl('progressGraphHolder');
    if (!progressGraphHolder) return;
    
    progressGraphHolder.innerHTML = ''; 
    for (let i = 0; i < plottingVals.length; i += 2) {
        const dot = document.createElement("tt");
        dot.classList.add('progressMarker');
        dot.id = plottingVals[i];
        dot.innerText = ".";
        dot.style.marginTop = (parseFloat(plottingVals[i + 1]) * 1.3) + "px";
        progressGraphHolder.appendChild(dot);
    }
}

function convertDailyProgressData(data, startingDate) {
    const isArray = Array.isArray(data);
    if (isArray) {
        const dataObj = {};
        for (let i = 0; i < data.length; i++) {
            dataObj[startingDate] = data[i];
            startingDate++;
        }
        return dataObj;
    } else {
        const dataArr = Object.entries(data).flat().map(Number);
        return dataArr;
    }
}

function resetDailyProgressVals() {
    updateUserData(1, "null", {});
}

// TO DO LIST FUNCTIONS
function createToDoDummy() {
    const taskHolderElDummy = createEditableToDoDummy();
    const taskBtn = taskHolderElDummy.querySelector('.completeTaskBtn');
    const tasktitleEl = taskHolderElDummy.querySelector('.TaskTittle');
    
    taskBtn.addEventListener('click', (e) => { createNewToDoFromDummyEl(e.currentTarget.parentElement) }, { once: true });
    const list = getEl('myToDoList');
    if(list) list.appendChild(taskHolderElDummy);
    tasktitleEl.focus();
}

function createNewToDoFromDummyEl(taskHolderDummy) {
    const taskObj = createTaskObjFromDummyEl(taskHolderDummy);
    const taskBtn = taskHolderDummy.querySelector('.completeTaskBtn');
    const taskIndexEl = taskHolderDummy.querySelector('.index');
    
    taskHolderDummy.classList.remove('dummyEl'); 
    taskHolderDummy.classList.add('realTask'); 
    
    disableContentEditable(taskHolderDummy);
    replaceDateEls(taskHolderDummy);
    
    taskBtn.addEventListener('click', (e) => { completeTask(e.currentTarget.parentElement); }, { once: true });
    taskBtn.innerText = 'Complete Task';
    
    taskIndexEl.innerText = userData[2].length;
    taskObj.index = userData[2].length;
    userData[2].push(taskObj);
    updateUserData(2, "null", userData[2]);
}

function completeTask(taskHolderEl) {
    const tasksNodes = Array.from(document.querySelectorAll('.realTask'));
    const index = tasksNodes.indexOf(taskHolderEl);
    if(index === -1) return;
    
    const taskObjsLi = userData[2];
    const taskOBj = taskObjsLi[index];
    if(!taskOBj) return;
    
    const completeTaskBtn = taskHolderEl.querySelector('.completeTaskBtn');
    taskOBj.isComplete = true;
    taskOBj.deadline = "completed";
    taskOBj.unitOftime = "";
    updateUserData(2, 'null', userData[2]);
    
    completeTaskBtn.onclick = (e) => { deleteTask(e.currentTarget.parentElement) };
    completeTaskBtn.innerText = 'Delete Task';
    
    const unitEl = taskHolderEl.querySelector('.unitOfTime');
    const dueEl = taskHolderEl.querySelector('.dueDate');
    if(unitEl) unitEl.innerText = '';
    if(dueEl) dueEl.innerText = 'completed';
}

function deleteTask(taskHolderEl) {
    const tasksNodes = Array.from(document.querySelectorAll('.realTask'));
    const index = tasksNodes.indexOf(taskHolderEl);
    if(index === -1) return;
    
    const taskObjsLi = userData[2];
    taskObjsLi.splice(index, 1);
    taskHolderEl.remove();
    updateUserData(2, "null", userData[2]);
}

function loadTasksFromDB() {
    const taskObjsLi = userData[2];
    const toDoListEl = getEl('myToDoList');
    if (taskObjsLi.length <= 0 || !toDoListEl) return;
    
    for (let i = 0; i < taskObjsLi.length; i++) {
        const currTaskObj = taskObjsLi[i];
        const taskEl = createToDoElFromTaskobj(currTaskObj);
        toDoListEl.appendChild(taskEl);
    }
}

function updateToDosDeadline(boolUseSession = true) {
    let timePassed;
    if (boolUseSession) {
        timePassed = getTimePassed(userData[3].currSession, userData[3].lastSeen);
    } else {
        // FIX: Compare to currSession (exact last active moment), not lastSeen
        timePassed = getTimePassed(userData[3].currLogin, userData[3].currSession);
    }
    updateDeadlinesOnDb(timePassed[0], timePassed[1], timePassed[2]);
}

function createEditableToDoDummy() {
    const taskHolderElDummy = createEl('div');
    const taskTitleEl = createEl('h5');
    const taskContentHolder = createEl('span');
    const lineBraek = createEl('br');
    const dateCreatedEl = createEl('tt');
    const taskDatesEl = createEl('span');
    const dueDateInpt = createEl('input');
    const unitOfTimeSelect = createEl('select');
    const optionDays = createEl('option');
    const optionHours = createEl('option');
    const optionMins = createEl('option');
    const createTaskBtn = createEl('button');
    const taskIndexEl = createEl('tt');
    
    taskHolderElDummy.classList.add('taskHolder', 'dummyEl'); 
    taskTitleEl.classList.add('TaskTittle');
    taskContentHolder.classList.add('taskcontentHolder');
    dateCreatedEl.classList.add('dateCreated');
    taskDatesEl.classList.add('taskDates');
    dueDateInpt.classList.add('dueDate');
    unitOfTimeSelect.classList.add('unitOfTime');
    createTaskBtn.classList.add('completeTaskBtn');
    taskIndexEl.classList.add('index');
    
    taskTitleEl.contentEditable = 'true';
    taskContentHolder.contentEditable = 'true';
    dueDateInpt.type = 'number';
    optionDays.value = 'days';
    optionHours.value = 'hours';
    optionMins.value = 'minutes';
    
    taskTitleEl.innerText = 'EDIT TASK TITLE HERE';
    taskContentHolder.innerText = 'edit task content here';
    dateCreatedEl.innerText = new Date().toDateString();
    optionDays.innerText = 'days';
    optionHours.innerText = 'hours';
    optionMins.innerText = 'minutes';
    createTaskBtn.innerText = 'create this Task';
    
    unitOfTimeSelect.appendChild(optionDays);
    unitOfTimeSelect.appendChild(optionHours);
    unitOfTimeSelect.appendChild(optionMins);
    taskDatesEl.appendChild(dueDateInpt);
    taskDatesEl.appendChild(unitOfTimeSelect);
    taskHolderElDummy.appendChild(taskTitleEl);
    taskHolderElDummy.appendChild(taskContentHolder);
    taskContentHolder.appendChild(lineBraek);
    taskHolderElDummy.appendChild(dateCreatedEl);
    taskHolderElDummy.appendChild(taskDatesEl);
    taskHolderElDummy.appendChild(createTaskBtn);
    taskHolderElDummy.appendChild(taskIndexEl);
    return taskHolderElDummy;
}

function replaceDateEls(taskHolderDummy) {
    const taskDatesEl = taskHolderDummy.querySelector('.taskDates');
    const dateDueInpt = taskDatesEl.children[0];
    const unitOfTimeInpt = taskDatesEl.children[1];
    const dueDateEl = createEl('tt');
    const unitOfTimeEl = createEl('tt');
    
    unitOfTimeEl.classList.add('unitOfTime', 'daysLeft');
    dueDateEl.classList.add('dueDate');
    unitOfTimeEl.innerText = unitOfTimeInpt.value;
    dueDateEl.innerText = dateDueInpt.value;
    taskDatesEl.replaceChildren(dueDateEl, unitOfTimeEl);
}

function disableContentEditable(taskHolderDummy) {
    const titleEl = taskHolderDummy.querySelector('.TaskTittle');
    const contentEl = taskHolderDummy.querySelector('.taskcontentHolder');
    titleEl.removeAttribute('contentEditable');
    contentEl.removeAttribute('contentEditable');
}

function createTaskObjFromDummyEl(taskHolderDummy) {
    const titleEl = taskHolderDummy.querySelector('.TaskTittle');
    const contentEl = taskHolderDummy.querySelector('.taskcontentHolder');
    const taskDatesEl = taskHolderDummy.querySelector('.taskDates');
    const deadlineEl = taskDatesEl.querySelector('.dueDate');
    const unitOfTimeEl = taskDatesEl.querySelector('.unitOfTime');
    
    const now = new Date().toDateString();
    return createTaskObj(titleEl.innerText, contentEl.innerText, now, deadlineEl.value, unitOfTimeEl.value, false);
}

function createToDoElFromTaskobj(taskObj) {
    const isComplete = (taskObj.isComplete === true || taskObj.isComplete === "true"); 
    const taskHolderEl = createEl('div');
    const taskTitleEl = createEl('h5');
    const taskContentHolder = createEl('span');
    const lineBraek = createEl('br');
    const dateCreatedEl = createEl('tt');
    const taskDatesEl = createEl('span');
    const dueDateEl = createEl('tt');
    const unitOfTimeEl = createEl('tt');
    const taskActionBtn = createEl('button');
    const taskIndexEl = createEl('tt');
    
    taskTitleEl.innerText = taskObj.title;
    taskContentHolder.innerText = taskObj.content;
    dateCreatedEl.innerText = taskObj.dateCreated;
    dueDateEl.innerText = taskObj.deadline;
    taskIndexEl.innerText = taskObj.index;
    
    if (!isComplete) {
        taskActionBtn.innerText = 'Complete Task';
        unitOfTimeEl.innerText = taskObj.unitOftime + ' left';
        taskActionBtn.onclick = (e) => { completeTask(e.currentTarget.parentElement); };
    } else {
        taskActionBtn.innerText = 'Delete Task';
        unitOfTimeEl.innerText = taskObj.unitOftime || "";
        taskActionBtn.onclick = (e) => { deleteTask(e.currentTarget.parentElement) };
    }
    
    taskDatesEl.appendChild(dueDateEl);
    taskDatesEl.appendChild(unitOfTimeEl);
    taskHolderEl.appendChild(taskTitleEl);
    taskHolderEl.appendChild(taskContentHolder);
    taskDatesEl.appendChild(lineBraek);
    taskHolderEl.appendChild(dateCreatedEl);
    taskHolderEl.appendChild(taskDatesEl);
    taskHolderEl.appendChild(taskActionBtn);
    taskHolderEl.appendChild(taskIndexEl);
    
    taskHolderEl.classList.add('taskHolder', 'realTask');
    taskTitleEl.classList.add('TaskTittle');
    taskContentHolder.classList.add('taskContentHolder');
    dateCreatedEl.classList.add('dateCreated');
    taskDatesEl.classList.add('taskDates');
    dueDateEl.classList.add('dueDate');
    unitOfTimeEl.classList.add('unitOfTime', 'daysLeft');
    taskActionBtn.classList.add('completeTaskBtn');
    taskIndexEl.classList.add('index');
    
    return taskHolderEl;
}

function createTaskObj(title, content, dateCreated, deadline, unitOftime, isComplete) {
    return { title, content, dateCreated, deadline, unitOftime, isComplete };
}

function updateDeadlinesOnDb(daysPassed, hoursPassed, minsPassed) {
    const taskObjsLi = userData[2];
    if (!taskObjsLi || !taskObjsLi.length) return;
    
    const timePassedInMins = (daysPassed * 1440) + (hoursPassed * 60) + minsPassed;

    for (let i = 0; i < taskObjsLi.length; i++) {
        const currtaskObj = taskObjsLi[i];
        if (currtaskObj.isComplete === true || currtaskObj.isComplete === "true") continue;
        
        let currUnitOfTime = currtaskObj.unitOftime || 'minutes';
        let deadlineInt = parseFloat(currtaskObj.deadline) || 0;
        
        let deadlineInMins = 0;
        if (currUnitOfTime === 'days') deadlineInMins = deadlineInt * 1440;
        else if (currUnitOfTime === 'hours') deadlineInMins = deadlineInt * 60;
        else deadlineInMins = deadlineInt;

        deadlineInMins -= timePassedInMins;

            if (currUnitOfTime === 'days') currtaskObj.deadline = +(deadlineInMins / 1440).toFixed(2);
            else if (currUnitOfTime === 'hours') currtaskObj.deadline = +(deadlineInMins / 60).toFixed(2);
            else currtaskObj.deadline = Math.floor(deadlineInMins);
    }
    updateUserData(2, "null", userData[2]);
}

function updateToDoDeadlinesOnUI() {
    const taskObjLi = userData[2];
    const taskHolderEls = document.querySelectorAll('.realTask');
    
    if (!taskObjLi || !taskHolderEls.length) return;
    
    for (let i = 0; i < taskObjLi.length; i++) {
        const currTaskobj = taskObjLi[i];
        const currTaskEl = taskHolderEls[i];
        if (!currTaskEl) continue; 
        
        const currTaskDatesEl = currTaskEl.querySelector('.taskDates');
        if (!currTaskDatesEl || !currTaskDatesEl.children[0]) continue;
        if (currTaskDatesEl.children[0].tagName === 'INPUT') continue;
        
        currTaskDatesEl.children[0].innerText = currTaskobj.deadline;
    }
}

// GENERAL INITIALIZATION FUNCTIONS 
function getTimePassed(dateA, dateB) {
    const timeA = new Date(dateA || new Date());
    const timeB = new Date(dateB || new Date());
    
    const diffMs = Math.max(0, timeA.getTime() - timeB.getTime());
    const diffMins = Math.floor(diffMs / 60000);
    
    const days = Math.floor(diffMins / 1440);
    const hours = Math.floor((diffMins % 1440) / 60);
    const mins = diffMins % 60;
    
    const isNextDay = (timeA.getDate() !== timeB.getDate()) || (diffMs >= 86400000);
    
    return [days, hours, mins, isNextDay ? 1 : 0]; 
}

function resetGraphVals() {
    const defaultVals = userData[0];
    for (let key in defaultVals) defaultVals[key] = 0;
    updateUserData(0, "null", defaultVals);
}

function adjustGraphIds(graphValObj) {
    let myArr = Object.entries(graphValObj).flat();
    let margins = ['20vw', '35vw', '55vw', '0vw', '20vw', '30vw'];
    const graphs = getEls('barGraph');
    
    for (let i = 0; i < graphs.length; i++) {
        if (!graphs[i]) continue;
        let graphIdName = myArr[i * 2];
        graphs[i].id = graphIdName;
        graphs[i].innerText = graphIdName;
        graphs[i].onclick = () => { graphUpdate(graphIdName, margins[i] || '0vw'); };
    }
}

// USER DATA FUNCTIONS 
function updateUserData(index, objectKey, value, subjectKey) {
    if (index == null) {
        // do nothing
    } else if (subjectKey && objectKey) {
        userData[index][objectKey][subjectKey] = value;
    } else if (objectKey === "null") {
        userData[index] = value;
        if (index === 4) {
            adjustGraphIds(value);
        }
    } else if (subjectKey === undefined && objectKey !== undefined && objectKey !== null) {
        userData[index][objectKey] = value;
    } else {
        if(Array.isArray(userData[index])) userData[index].push(value);
    }
    localStorage.setItem("userData", JSON.stringify(userData));
}

function createUserData() {
    const date = new Date();
    userData = [
        { earning: 15, saving: 15, coding: 15, drawing: 15, others: 15, sleep: 15 },
        {},
        [],
        { name: "John Doe", lastLogin: date, currLogin: date, lastSeen: date, currSession: date },
        { earning: 100, saving: 100, coding: 100, drawing: 100, others: 100, sleep: 100 },
        [1, 1, 1, 1, 1, 1]
    ];
    localStorage.setItem("userData", JSON.stringify(userData));
}

function updateCurrentSession() {
    const newCurrSession = new Date();
    const newLastSeen = userData[3]['currSession'] || new Date();
    updateUserData(3, 'lastSeen', newLastSeen);
    updateUserData(3, 'currSession', newCurrSession);
}

function objToArr(data, boolFlattenIt, boolRemoveVals, keys_0_Vals_1 = 0) {
    let arr = Object.entries(data);
    if (boolRemoveVals) {
        for (let i = 0; i < arr.length; i++) arr[i].splice(keys_0_Vals_1, 1);
    }
    if (boolFlattenIt) arr = arr.flat();
    return arr;
}

// CHANGING BENCHMARKS functions
function updateFormVals(trackableId) {
    const trackables = getEls(trackableId);
    const trackable = getEl(trackableId);
    if (!trackable) return;
    for (let i = 0; i < trackables.length; i++) {
        trackables[i].innerText = trackable.value;
    }
}

function finishSetBenchmarks() {
    const trackableA = getEl('trackableA')?.value || 'earning';
    const trackableB = getEl('trackableB')?.value || 'saving';
    const trackableC = getEl('trackableC')?.value || 'coding';
    const trackableD = getEl('trackableD')?.value || 'drawing';
    const trackableE = getEl('trackableE')?.value || 'others';
    const trackableF = getEl('trackableF')?.value || 'sleep';
    
    const graphVals = getGrahValsAsArray();
    const selects = document.getElementsByTagName('select');
    const targets = getEls('target');
    const targetVals = [];
    const isConstructiveList = [];
    
    for (let i = 0; i < selects.length; i++) {
        let selectsval = selects[i].value;
        let targetsVal = parseFloat(targets[i]?.value) || 100;
        isConstructiveList.push(selectsval);
        targetVals.push(targetsVal);
    }
    
    const newGraphVals = {
        [trackableA]: graphVals[0] || 0, [trackableB]: graphVals[1] || 0,
        [trackableC]: graphVals[2] || 0, [trackableD]: graphVals[3] || 0,
        [trackableE]: graphVals[4] || 0, [trackableF]: graphVals[5] || 0
    };
    
    const newTargetVals = {
        [trackableA]: targetVals[0], [trackableB]: targetVals[1],
        [trackableC]: targetVals[2], [trackableD]: targetVals[3],
        [trackableE]: targetVals[4], [trackableF]: targetVals[5]
    };
    
    updateUserData(0, "null", newGraphVals);
    updateUserData(4, "null", newTargetVals);
    updateUserData(5, "null", isConstructiveList);
    hidePopUp('setBenchmarksHolder');
}

function appendBenchmarks() {
    const trackablesNames = objToArr(userData[0], true, true, 1);
    const trackablesInpts = getEls('trackables');
    const goals = objToArr(userData[4], true, true);
    const goalsInpts = getEls('target');
    const isConstructiveLi = userData[5];
    const isConstructiveInpts = getEls('isConstructiveInpt');
    
    const isOk = (trackablesNames.length + trackablesInpts.length + goals.length + goalsInpts.length + isConstructiveLi.length + isConstructiveInpts.length) === 36;
    if (isOk) {
        for (let i = 0; i < 6; i++) {
            trackablesInpts[i].value = trackablesNames[i];
            goalsInpts[i].value = goals[i];
            isConstructiveInpts[i].value = isConstructiveLi[i];
        }
    }
}

function updateSessionData() {
    updateCurrentSession();
    updateToDosDeadline(true);
    updateToDoDeadlinesOnUI();
}

function setUp() {
    const date = new Date();
    const storageData = localStorage.getItem("userData");
    
    if (!storageData) {
        createUserData();
    } else {
        try {
            userData = JSON.parse(storageData);
        } catch(e) {
            createUserData();
        }
    }
    
    let lastLoginDate = userData[3]["currLogin"] || date;
    updateUserData(3, "lastLogin", lastLoginDate);
    updateUserData(3, "currLogin", date);
    
    const timePassedArr = getTimePassed(userData[3]['currLogin'], lastLoginDate);
    const daysPassed = parseInt(timePassedArr[0]);
    const isNextDay = timePassedArr[3];
    
    if (isNextDay && daysPassed < 29 && daysPassed >= 0) {
        const lastLoginDay = new Date(lastLoginDate).getDate();
        const isMultiDayAbsence = daysPassed > 1;
        let graphVals = getGrahValsAsArray();
        let plottingVal = averageOut(graphVals);
        
        let plottings = isMultiDayAbsence ? new Array(daysPassed).fill(0) : [plottingVal];
        plottings[0] = plottingVal;
        
        plottings = convertDailyProgressData(plottings, lastLoginDay);
        plottings = { ...userData[1], ...plottings };
        updateUserData(1, "null", plottings);
        resetGraphVals();
    } else if (daysPassed > 28) {
        resetDailyProgressVals();
        resetGraphVals();
    }
    
    adjustGraphIds(userData[0]); 
    appendBenchmarks();
    
    const graphVals = Object.entries(userData[0]);
    for (let i = 0; i < graphVals.length; i++) {
        const theGraphStr = graphVals[i][0];
        let newGraphHeight = parseFloat(graphVals[i][1]) || 0;
        let goal = parseFloat(userData[4][theGraphStr]) || 100;
        
        newGraphHeight = (newGraphHeight / goal) * 100;
        const graphEl = getEl(theGraphStr);
        if (graphEl) graphEl.style.height = newGraphHeight + "%";
    }
    
    let plottingVals = convertDailyProgressData(userData[1]);
    plotGraph(plottingVals);
    updateToDosDeadline(false);
    loadTasksFromDB();
    
    updateUserData(3, 'lastSeen', date);
    updateUserData(3, 'currSession', date);
}

setUp();
setInterval(updateSessionData, 60000);