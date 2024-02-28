// import 'https://tomashubelbauer.github.io/github-pages-local-storage/index.js';

function print(pass) { 
    console.log(pass);
}

let clock_in_data = new Date();
let clocked_in = 0;
let clocked_out = 0;
let on_break = 0;
let settings_data = {
    clocked_in: 0,
    clocked_out: 0,
    on_break : 0,
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

let clock_out_time_data = new Date(); 

function updateUI() {
    clock_in_button.disabled = clocked_in || on_break;
    clock_out_button.disabled = !clocked_in || on_break;
    take_break_button.disabled = !clocked_in || on_break;
    end_break_button.disabled = !on_break || !clocked_in;

    if (clocked_in && !on_break) {
        status_element.hidden = false;
        status_element.textContent = "Clocked in";
        status_element.style.color = 'rgb(0, 255, 38)';
    } else if (on_break) {
        status_element.hidden = false;
        status_element.textContent = "On break";
        status_element.style.color = "red";
    } else {
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
        break_start_time_data = new Date(data.break_start_time);
        break_end_time_data = new Date(data.break_end_time);
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
let clock = document.getElementById("clock");
let status_element = document.getElementById("status");

clock_in_button.addEventListener("click", clock_in);
clock_out_button.addEventListener("click", clock_out);
take_break_button.addEventListener("click", take_break);
end_break_button.addEventListener("click", end_break);

let break_start_time_data = new Date();
let break_end_time_data = new Date();

// localStorage.clear();
loadSavedState();

updateStorage();
function clock_in() {
    clock_in_data = new Date();
    clocked_in = 1;
    clock_out_time_data = new Date();
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

function take_break() {
    break_start_time_data = new Date();
    on_break = 1;
    updateUI();
    updateStorage();
}

function end_break() { 
    break_end_time_data = new Date();
    on_break = 0;
    const diff_in_mins = calculateBreakTime(break_start_time_data, break_end_time_data);
    const diff_in_hours = Math.floor(diff_in_mins / 60);
    const remaining_mins = diff_in_mins % 60;
    clock_out_time_data.setHours(clock_out_time_data.getHours() + diff_in_hours);
    clock_out_time_data.setMinutes(clock_out_time_data.getMinutes() + remaining_mins);
    updateUI();
    updateStorage();
}

function calculateBreakTime(start, end) {
    const diffInMinutes = Math.abs(end - start) / 60000;
    return diffInMinutes;
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

