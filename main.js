// import 'https://tomashubelbauer.github.io/github-pages-local-storage/index.js';
// Created by Tyler Strasser

function print(pass) { 
    console.log(pass);
}

let clock_in_data = new Date();
let clock_out_time_data = new Date(); 
let break_start_time_data = new Date();
let break_end_time_data = new Date();
let lunch_start_time_data = new Date();
let lunch_end_time_data = new Date();

let clocked_in = 0;
let clocked_out = 0;
let on_break = 0;
let on_lunch = 0;

let settings_data = {
    clocked_in: 0,
    clocked_out: 0,
    on_break : 0,
    on_lunch: 0,
    lunch_start_time: 0,
    lunch_end_time: 0,
    break_start_time: 0,
    break_end_time: 0,
    clock_in_time: 0,
    clock_out_time: 0};


/*
localstorage apparently can only store strings

// Store
let myObject = {name: "John", age: 30};
localStorage.setItem("myObject", JSON.stringify(myObject));

// Retrieve
let myObject = JSON.parse(localStorage.getItem("myObject"));
*/

// localStorage.setItem("clock_in_data", clock_in_data);
// var local_time = clock_in_data.toLocaleTimeString();



function updateUI() {
    clock_in_button.disabled = clocked_in || on_break || on_lunch;
    clock_out_button.disabled = !clocked_in || on_break || on_lunch;
    take_break_button.disabled = !clocked_in || on_break || on_lunch;
    end_break_button.disabled = !on_break || !clocked_in || on_lunch;
    take_lunch_button.disabled = !clocked_in || on_lunch || on_break;
    end_lunch_button.disabled = !on_lunch || !clocked_in || on_break;


    if (clocked_in && !on_break && !on_lunch) {
        status_element.hidden = false;
        status_element.textContent = "Clocked in";
        status_element.style.color = 'rgb(0, 255, 38)';
    } else if (on_break) {
        status_element.hidden = false;
        status_element.textContent = "On break";
        status_element.style.color = "red";
    }
    else if (on_lunch) {
        status_element.hidden = false;
        status_element.textContent = "On lunch";
        status_element.style.color = "orange";
    
    } 
    else {
        status_element.hidden = true;
    }

    if (clocked_in) {
        clock.textContent = "Clock out time: " + clock_out_time_data.toLocaleTimeString();
    } else {
        clock.textContent = "Not clocked in yet";
    }
}


function loadSavedState() {
    // Check if there's any saved state in localStorage
    if (localStorage.getItem("time_data")) {
        // If so, update the global variables with the saved state
        let data = JSON.parse(localStorage.getItem("time_data"));
        clocked_in = data.clocked_in;
        clocked_out = data.clocked_out;
        on_break = data.on_break;
        on_lunch = data.on_lunch;
        break_start_time_data = new Date(data.break_start_time);
        break_end_time_data = new Date(data.break_end_time);
        lunch_start_time_data = new Date(data.lunch_start_time);
        lunch_end_time_data = new Date(data.lunch_end_time);
        clock_in_data = new Date(data.clock_in_time);
        clock_out_time_data = new Date(data.clock_out_time);
        updateUI();
         }
}
function updateStorage() { 
    // Update settings_data with the current state of the clock
    updateSettings();

    // Save settings_data to localStorage
    localStorage.setItem("time_data", JSON.stringify(settings_data));

    // Update global variables with saved state
    // loadSavedState();
}



  
let clock_in_button = document.getElementById("clock_in");
let clock_out_button = document.getElementById("clock_out");
let take_break_button = document.getElementById("take_break");
let end_break_button = document.getElementById("end_break");
let take_lunch_button = document.getElementById("take_lunch");
let end_lunch_button = document.getElementById("end_lunch");
let clock = document.getElementById("clock");
let status_element = document.getElementById("status");

clock_in_button.addEventListener("click", clock_in);
clock_out_button.addEventListener("click", clock_out);
take_lunch_button.addEventListener("click", take_lunch);
end_lunch_button.addEventListener("click", end_lunch);
take_break_button.addEventListener("click", take_break);
end_break_button.addEventListener("click", end_break);



// localStorage.clear();
loadSavedState();

updateStorage();
function clock_in() {
    clock_in_data = new Date();
    clock_out_time_data = new Date();
    clocked_in = 1;
    clock_out_time_data.setHours(clock_in_data.getHours() + 8);
    updateUI();
    updateStorage();
}

function clock_out() {
    clocked_in = 0;
    clocked_out = 1;
    clock_out_time_data = new Date();
    updateUI();
    updateStorage();

}

function take_lunch() {
    lunch_start_time_data = new Date();
    on_lunch = 1;
    updateUI();
    updateStorage();

}

function end_lunch() {
    lunch_end_time_data = new Date();
    on_lunch = 0;
    calculateBreakTime(lunch_start_time_data, lunch_end_time_data, regular_break=0);
    updateUI();
    updateStorage();

}

function take_break() {
    break_start_time_data = new Date();
    on_break = 1;
    updateUI();
    updateStorage();
}


function end_break() { 
    break_end_time_data = new Date();
    on_break = 0;
    calculateBreakTime(break_start_time_data, break_end_time_data);
    updateUI();
    updateStorage();
}

function calculateBreakTime(start, end, regular_break=1) {
    let diff_test = end - start;
    let diff_in_mins = Math.abs(end - start) / 60000;
    
    if (regular_break == 1) {
        diff_in_mins = Math.max(diff_in_mins - 10, 0);
    }
    const diff_in_hours = Math.floor(diff_in_mins / 60);
    const remaining_mins = diff_in_mins % 60;
    clock_out_time_data.setHours(clock_out_time_data.getHours() + diff_in_hours);
    clock_out_time_data.setMinutes(clock_out_time_data.getMinutes() + remaining_mins);
    return diff_in_mins;
}


function updateSettings() {
    settings_data.clocked_in = clocked_in;
    settings_data.clocked_out = clocked_out;
    settings_data.on_break = on_break;
    settings_data.break_start_time = break_start_time_data;
    settings_data.break_end_time = break_end_time_data;
    settings_data.clock_in_time = clock_in_data;
    settings_data.clock_out_time = clock_out_time_data;
}

