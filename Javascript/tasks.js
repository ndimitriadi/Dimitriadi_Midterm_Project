const add_button = document.querySelector("#add_button");
const tasks_form_container = document.querySelector("#tasks_form_container");
const tasks_form = document.querySelector("#tasks_form");
const task_table_body = document.querySelector("#task_table_body");
const clear_all_button = document.querySelector("#clear_all_button");

let tasks = [];
let edit_index = null;

// ----------------------- SHOW/HIDE NEW TASK FORM ---------------------------------------

add_button.addEventListener("click", (e) => {
    tasks_form_container.classList.toggle("hidden");
});

// ----------------------- LOAD TASKS ON PAGE LOAD ---------------------------------------

document.addEventListener("DOMContentLoaded", () => { //waits for the HTML to be fully loaded
    const storedTasks = localStorage.getItem("tasks"); //gets data from local storage

    if (storedTasks) {
        tasks = JSON.parse(storedTasks); //converts data string to JavaScript array
        tasks.forEach((task, index) => add_task(task, index)); //rebuilds table
    }
});

// ----------------------- DATES MIN-MAX ------------------------------------------------

// .toISOString() converts the input to the approriate format for the data type date (YYYY-MM-DD)
// .split('T')[0] sprits the string so we only keep the date and not the time
const today = new Date().toISOString().split('T')[0];
document.querySelector('#date').min = today;
//setFullYear retuns the current year, it adds to years and then sets it as the new year
document.querySelector('#date').max = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0];


// ----------------------- ADD NEW TASK - SUBMIT ---------------------------------------

tasks_form.addEventListener("submit", (e) => {
    e.preventDefault(); //prevents default action of submit type button - reloading page

    const task = {
        place: document.querySelector("#place").value,
        description: document.querySelector("#description").value,
        date: document.querySelector("#date").value,
        status: document.querySelector("#status").value,
        priority: document.querySelector("#priority").value
    };

    if (edit_index !== null) { //editing
        tasks[edit_index] = task; //overwriting old object in the same position
        save_tasks(); //saves updated array to localStorage
        render_table();
        edit_index = null;

    } else { //adding
        tasks.push(task); //adds new task to the array
        save_tasks(); //saves to localStorage
        add_task(task, tasks.length - 1); //adds only the new row
    }

    tasks_form.reset();
    tasks_form_container.classList.add("hidden");
});


// ----------------------- ADD NEW TASK TO THE TABLE ---------------------------------------

function add_task(task, index) {
    const new_row = task_table_body.insertRow();

    new_row.innerHTML = `
        <td>${task.place}</td>
        <td>${task.description}</td>
        <td>${task.date}</td>
        <td>${task.status}</td>
        <td class="${task.priority}">
            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </td>
        <td>
            <button class="edit_button">✏️ Edit</button>
            <button class="delete_button">🗑 Delete</button>
            <button class="complete_button">✅ Visited</button>
        </td>
    `;

    const edit_button = new_row.querySelector(".edit_button");
    const delete_button = new_row.querySelector(".delete_button");
    const complete_button = new_row.querySelector(".complete_button");

    //delete button
    delete_button.addEventListener("click", () => {
        tasks.splice(index, 1); //removes the task from the array
        save_tasks();
        render_table();
    });

    //complete button
    complete_button.addEventListener("click", () => {
        tasks[index].status = "Visited";
        save_tasks();
        render_table();
    });

    //edit button
    edit_button.addEventListener("click", () => {
        //replaces the cells with inputs
        new_row.cells[0].innerHTML = `<input type="text" value="${task.place}">`;
        new_row.cells[1].innerHTML = `<input type="text" value="${task.description}">`;
        new_row.cells[2].innerHTML = `<input type="date" value="${task.date}">`;
        
        //selected option in the status dropdown
        let option_to_Visit = "";
        let option_visited = "";
        if (task.status === "To Visit") {
            option_to_visit = " selected";
        }
        if (task.status === "Visited") {
            option_visited = " selected";
        }
        //dropdown
        new_row.cells[3].innerHTML = `
            <select>
                <option${option_to_visit}>To Visit</option>
                <option${option_visited}>Visited</option>
            </select>
        `;

        //priority dropdown
        let option_low = "";
        let option_medium = "";
        let option_high = "";
        if (task.priority === "low") {
            option_low = " selected";
        } else if (task.priority === "medium") {
            option_medium = " selected";
        } else if (task.priority === "high") {
            option_high = " selected";
        }
        new_row.cells[4].innerHTML = `
            <select>
                <option value="low"${option_low}>Low</option>
                <option value="medium"${option_medium}>Medium</option>
                <option value="high"${option_high}>High</option>
            </select>
        `;
    
        //date min-max
        const date_input = new_row.cells[2].querySelector("input[type='date']");
        const today = new Date().toISOString().split('T')[0];
        const max_date = new Date(new Date().setFullYear(new Date().getFullYear() + 2))
                            .toISOString().split('T')[0];
        date_input.min = today;
        date_input.max = max_date;

        //Place and Description character limit
        const place_input = new_row.cells[0].querySelector("input");
        const description_input = new_row.cells[1].querySelector("input");
        place_input.maxLength = 50;
        description_input.maxLength = 200;
    
        //editing new buttons - save and cancel
        new_row.cells[5].innerHTML = `
            <button class="save_button">💾 Save</button>
            <button class="cancel_button">❌ Cancel</button>
        `;
        const save_button = new_row.querySelector(".save_button");
        const cancel_button = new_row.querySelector(".cancel_button");
    
        save_button.addEventListener("click", () => {
            const updated_task = {
                place: new_row.cells[0].querySelector("input").value,
                description: new_row.cells[1].querySelector("input").value,
                date: new_row.cells[2].querySelector("input").value,
                status: new_row.cells[3].querySelector("select").value,
                priority: new_row.cells[4].querySelector("select").value
            };
            tasks[index] = updated_task;
            save_tasks();
            render_table();
        });
    
        cancel_button.addEventListener("click", () => {
            render_table();
        });
    });
}


//----------------------- RENDERING THE TABLE ---------------------------------------
function render_table() { //clears all rows and rebuilts
    task_table_body.innerHTML = ""; 
    tasks.forEach((task, index) => add_task(task, index));
}

// -----------------------SAVING TO localStorage ---------------------------------------
function save_tasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// -----------------------CLEARING ALL TASKS---------------------------------------
clear_all_button.addEventListener("click", () => {
    // Show confirmation popup
    const confirmClear = window.confirm("Are you sure you want to clear all favorites? This cannot be undone.");
    
    if (confirmClear) {
        localStorage.removeItem("tasks");
        tasks = [];
        task_table_body.innerHTML = "";
    } else {
        return;
    }
});