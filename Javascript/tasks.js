const add_button = document.querySelector("#add_button");
const tasks_form_container = document.querySelector("#tasks_form_container");
const tasks_form = document.querySelector("#tasks_form");
const task_table_body = document.querySelector("#task_table_body");
const clear_all_button = document.querySelector("#clear_all_button");

let tasks = [];
let edit_index = null;

// ----------------------- SHOW/HIDE NEW TASK FORM ---------------------------------------

add_button.addEventListener("click", (e) => {
    tasks_form_container.classList.toggle("show-form");
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
    tasks_form_container.classList.remove("show-form");
});

const cancel_task_button = document.querySelector("#cancel_task_button");

if (cancel_task_button) {
    cancel_task_button.addEventListener("click", () => {
        tasks_form.reset(); // Clears any text they might have started typing
        tasks_form_container.classList.remove("show-form"); // Hides the form box
        edit_index = null; // Resets the edit mode just in case
    });
}


// ----------------------- ADD NEW TASK TO THE TABLE ---------------------------------------

function add_task(task, index) {
    const new_row = task_table_body.insertRow();

    let priority_text;

    if (task.priority === "low") {
        priority_text = "Optional";
    } else if (task.priority === "medium") {
        priority_text = "Maybe";
    } else if (task.priority === "high") {
        priority_text = "Must Visit";
    } else {
        priority_text = task.priority;
    }

    new_row.innerHTML = `
        <td>${task.place}</td>
        <td>${task.description}</td>
        <td>${task.date}</td>
        <td>${task.status}</td>
        <td class="${task.priority}">
            ${priority_text}
        </td>
        <td>
            <button class="edit_button"><i class="bi bi-pencil-square"></i> Edit</button>
            <button class="delete_button"><i class="bi bi-trash3"></i> Delete</button>
            <button class="complete_button"><i class="bi bi-check-circle"></i> Visited</button>
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
        new_row.cells[2].innerHTML = `<input type="date" value="${task.date}" onclick="this.showPicker()">`;
        
        //selected option in the status dropdown
        let option_to_visit = "";
        let option_visited = "";
        if (task.status === "Pending") {
            option_to_visit = " selected";
        }
        if (task.status === "Visited") {
            option_visited = " selected";
        }
        //dropdown
        new_row.cells[3].innerHTML = `
            <select>
                <option${option_to_visit}>Pending</option>
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
                <option value="low"${option_low}>Optional</option>
                <option value="medium"${option_medium}>Maybe</option>
                <option value="high"${option_high}>Must Visit</option>
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
            <button class="cancel_button"><i class="bi bi-x-lg"></i> Cancel</button>
            <button class="save_button"><i class="bi bi-floppy"></i> Save</button>
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

const confirmation_window = document.querySelector("#confirmation_window");
const answer_yes = document.querySelector("#answer_yes");
const answer_no = document.querySelector("#answer_no");

clear_all_button.addEventListener("click", () => {
    confirmation_window.style.display = "flex"; // show custom-confirm
});

answer_yes.addEventListener("click", () => {
    localStorage.removeItem("tasks");
    tasks = [];
    task_table_body.innerHTML = "";
    confirmation_window.style.display = "none"; // hide custom-confirm
});

answer_no.addEventListener("click", () => {
    confirmation_window.style.display = "none";
});

// closes custom-confirm if the user clicks outside the box
window.addEventListener("click", (e) => {
    if (e.target === confirmation_window) {
        confirmation_window.style.display = "none";
    }
});



//------------------FILTERING AND SORTING------------
// Select filter and sort controls
const statusFilter = document.querySelector("#statusFilter");
const sortTasks = document.querySelector("#sortTasks");

// Event listeners
statusFilter.addEventListener("change", renderTable);
sortTasks.addEventListener("change", renderTable);

