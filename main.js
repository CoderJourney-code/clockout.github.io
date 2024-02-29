// import 'https://tomashubelbauer.github.io/github-pages-local-storage/index.js';
// Created by Tyler Strasser
// TODO: Make it so clock updates when you first hit it and not delay a second. It's showing previous stuff. 
//TODO : Make the break timer work when you first clock in.

function print(pass) { 
    console.log(pass);
}

let clock_in_data = new Date();
let clock_out_time_data = new Date(); 
let break_start_time_data = new Date();
let break_end_time_data = new Date();
let lunch_start_time_data = new Date();
let lunch_end_time_data = new Date();
let break_time_data = new Date();

let clocked_in = 0;
let on_break = 0;
let on_lunch = 0;

let settings_data = {
    clocked_in: 0,
    on_break : 0,
    on_lunch: 0,
    lunch_start_time: 0,
    lunch_end_time: 0,
    break_start_time: 0,
    break_end_time: 0,
    break_time: 0,
    clock_in_time: 0,
    clock_out_time: 0};


function updateSettings() {
    settings_data.clocked_in = clocked_in;
    settings_data.on_break = on_break;
    settings_data.on_lunch= on_lunch;
    settings_data.break_start_time = break_start_time_data;
    settings_data.break_end_time = break_end_time_data;
    settings_data.break_time = break_time_data;
    settings_data.lunch_start_time = lunch_start_time_data;
    settings_data.lunch_end_time = lunch_end_time_data;
    settings_data.clock_in_time = clock_in_data;
    settings_data.clock_out_time = clock_out_time_data;
}

    
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
    break_timer.hidden = !on_break && !on_lunch;


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
    
    // Timer stuff
    let hours = break_time_data.getHours();
    let minutes = break_time_data.getMinutes();
    let seconds = break_time_data.getSeconds();
    minutes =(hours * 60) + minutes;
    let formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    break_timer.textContent = formattedTime;
    
}



function loadSavedState() {
    // Check if there's any saved state in localStorage
    if (localStorage.getItem("time_data")) {
        // If so, update the global variables with the saved state
        let data = JSON.parse(localStorage.getItem("time_data"));
        clocked_in = data.clocked_in;
        on_break = data.on_break;
        on_lunch = data.on_lunch;
        break_start_time_data = new Date(data.break_start_time);
        break_end_time_data = new Date(data.break_end_time);
        break_time_data = new Date(data.break_time);
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
}



  
const clock_in_button = document.getElementById("clock_in");
const clock_out_button = document.getElementById("clock_out");
const take_break_button = document.getElementById("take_break");
const end_break_button = document.getElementById("end_break");
const take_lunch_button = document.getElementById("take_lunch");
const end_lunch_button = document.getElementById("end_lunch");
const clock = document.getElementById("clock");
const status_element = document.getElementById("status");
const break_timer = document.getElementById("break_timer");

clock_in_button.addEventListener("click", clock_in);
clock_out_button.addEventListener("click", clock_out);
take_lunch_button.addEventListener("click", take_lunch);
end_lunch_button.addEventListener("click", end_lunch);
take_break_button.addEventListener("click", take_break);
end_break_button.addEventListener("click", end_break);




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
    clock_out_time_data = new Date();
    updateUI();
    updateStorage();

}

function take_lunch() {
    lunch_start_time_data = new Date();
    on_lunch = 1;
    clear_break_timer();
    startBreakTimer();
    updateUI();
    updateStorage();

}

function end_lunch() {
    lunch_end_time_data = new Date();
    on_lunch = 0;
    calculateBreakTime(lunch_start_time_data, lunch_end_time_data, regular_break=0);
    updateUI();
    clear_break_timer();
    updateStorage();

}

function take_break() {
    break_start_time_data = new Date();
    on_break = 1;
    clear_break_timer();
    startBreakTimer();
    updateUI();
    updateStorage();
}


function end_break() { 
    break_end_time_data = new Date();
    on_break = 0;
    calculateBreakTime(break_start_time_data, break_end_time_data);
    updateUI();
    clear_break_timer();
    updateStorage();
}

function clear_break_timer() { 
    break_time_data = new Date();
}

let timer = null;
function startBreakTimer() {
    /*
    I want the break timer to work like it stores maybe the 
    TODO: I can't make the break timer 0 here because I may call this when I first launch 
    */

    let spawn_new_time;
    if (on_break) {
        spawn_new_time = break_start_time_data;
    }
    else if (on_lunch) { 
        spawn_new_time = lunch_start_time_data;
    }
    else { 
        spawn_new_time = new Date();
    }
    // let seconds = 0;
    // let minutes = 0;
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }


     // Define the callback function
     const updateClock = () => {
        let new_time = new Date();
        let diff = (new_time - spawn_new_time);
        let diffInSeconds = Math.floor(diff / 1000);
        let hours = Math.floor(diffInSeconds / 3600);
        let minutes = Math.floor((diffInSeconds % 3600) / 60);
        let seconds = diffInSeconds % 60;
        break_time_data.setHours(hours);
        break_time_data.setMinutes(minutes);
        break_time_data.setSeconds(seconds);
        updateStorage();
        updateUI();
    };
    //Call function once
    updateClock();

    // Call the callback function every second
    timer = setInterval(updateClock, 1000);
    
}

function calculateBreakTime(start, end, regular_break=1) {
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

loadSavedState();
updateStorage();

window.onload = function() {
    if (on_break || on_lunch) {
        startBreakTimer();
    }
    
};