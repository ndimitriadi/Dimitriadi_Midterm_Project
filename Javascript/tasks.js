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
    }

    const savedFilter = localStorage.getItem("saved_filter");
    const savedSort = localStorage.getItem("saved_sort");

    if (savedFilter) {
        document.querySelector("#statusFilter").value = savedFilter;
    }
    if (savedSort) {
        document.querySelector("#sortTasks").value = savedSort;
    }


    render_table();
    
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
        render_table(); //adds only the new row
    }

    tasks_form.reset();
    tasks_form_container.classList.remove("show-form");
});

const cancel_task_button = document.querySelector("#cancel_task_button");

if (cancel_task_button) {
    cancel_task_button.addEventListener("click", () => {
        tasks_form.reset(); 
        tasks_form_container.classList.remove("show-form");
        edit_index = null; 
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
            <button class="edit_button" ><i class="bi bi-pencil-square" aria-hidden="true"></i> Edit</button>
            <button class="delete_button"><i class="bi bi-trash3" aria-hidden="true"></i> Delete</button>
            <button class="complete_button" ><i class="bi bi-check-circle" aria-hidden="true"></i> Visited</button>
        </td>
    `;

    const edit_button = new_row.querySelector(".edit_button");
    const delete_button = new_row.querySelector(".delete_button");
    const complete_button = new_row.querySelector(".complete_button");

    //delete button
    delete_button.addEventListener("click", () => {
       
        //new confirmation buttons
        new_row.cells[5].innerHTML = `
            <button class="cancel_row_delete"> <i class="bi bi-x-circle" aria-hidden="true"></i> No</button>
            <button class="confirm_row_delete"> <i class="bi bi-trash3-fill" aria-hidden="true"></i> Yes</button>
        `;

        const confirm_row_delete = new_row.querySelector(".confirm_row_delete");
        const cancel_row_delete = new_row.querySelector(".cancel_row_delete");

        //yes
        confirm_row_delete.addEventListener("click", () => {
            tasks.splice(index, 1); 
            save_tasks();
            render_table();
        });

        //no
        cancel_row_delete.addEventListener("click", () => {
            render_table();
        });
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
        new_row.cells[0].innerHTML = `<textarea rows="3" aria-label="Edit Place Name">${task.place}</textarea>`;
        new_row.cells[1].innerHTML = `<textarea rows="3" aria-label="Edit Description">${task.description}</textarea>`;
        new_row.cells[2].innerHTML = `<input type="date" value="${task.date}" aria-label="Edit Date" onclick="this.showPicker()">`;
    
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
            <select aria-label="Edit Status">
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
            <select aria-label="Edit Priority">
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
        const place_input = new_row.cells[0].querySelector("textarea");
        const description_input = new_row.cells[1].querySelector("textarea");
        place_input.maxLength = 50;
        description_input.maxLength = 200;
    
        //editing new buttons - save and cancel
        new_row.cells[5].innerHTML = `
            <button class="cancel_button" aria-label="Cancel editing"><i class="bi bi-x-lg" aria-hidden="true"></i> Cancel</button>
            <button class="save_button" aria-label="Save changes"><i class="bi bi-floppy" aria-hidden="true"></i> Save</button>
        `;
        const save_button = new_row.querySelector(".save_button");
        const cancel_button = new_row.querySelector(".cancel_button");
    
        save_button.addEventListener("click", () => {
            const updated_task = {
                place: new_row.cells[0].querySelector("textarea").value,
                description: new_row.cells[1].querySelector("textarea").value,
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
function render_table() { 

    update_summary();

    task_table_body.innerHTML = ""; 


    //empty table message
    if (tasks.length === 0) {
        task_table_body.innerHTML = `
            <tr>
                <td colspan="6" class="empty_table">
                    <i class="bi bi-inbox" aria-hidden="true"></i>
                    No favorites added yet. Click <strong>"Add Place"</strong> to get started!
                </td>
            </tr>
        `;
        return; 
    }

    //saving preferences to localStorage
    localStorage.setItem("saved_filter", statusFilter.value);
    localStorage.setItem("saved_sort", sortTasks.value);


    //mapping original index to tasks so edit and delete buttons function correctly
    let display_tasks = tasks.map((task, index) => {
        return { original_task: task, original_index: index };
    });

    //filtering
    const filter_value = statusFilter.value;
    if (filter_value !== "all") {
        display_tasks = display_tasks.filter(item => 
            item.original_task.status === filter_value || 
            item.original_task.priority === filter_value
        );
    }

    //sorting
    const sort_value = sortTasks.value;
    
    if (sort_value === "date-asc") {
        // Date: Oldest first
        display_tasks.sort((a, b) => new Date(a.original_task.date) - new Date(b.original_task.date));
        
    } else if (sort_value === "date-desc") {
        // Date: Newest first (swapped a and b)
        display_tasks.sort((a, b) => new Date(b.original_task.date) - new Date(a.original_task.date));
        
    } else if (sort_value === "place-asc") {
        // Place: A to Z
        display_tasks.sort((a, b) => a.original_task.place.localeCompare(b.original_task.place));
        
    } else if (sort_value === "place-desc") {
        // Place: Z to A (swapped a and b)
        display_tasks.sort((a, b) => b.original_task.place.localeCompare(a.original_task.place));
    }

    //no match
    if (display_tasks.length === 0 && tasks.length > 0) {
        task_table_body.innerHTML = `
            <tr>
                <td colspan="6" class="empty_table">
                    No tasks match your filter.
                </td>
            </tr>
        `;
        return;
    }


    display_tasks.forEach(item => add_task(item.original_task, item.original_index));
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
    render_table();
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
statusFilter.addEventListener("change", render_table);
sortTasks.addEventListener("change", render_table);



// ----------------------- UPDATE SUMMARY---------------------------------------
function update_summary() {
    const total_element = document.querySelector("#total_count");
    const pending_element = document.querySelector("#pending_count");
    const visited_element = document.querySelector("#visited_count");

    let visited_count = 0;
    let pending_count = 0;

    tasks.forEach(task => {
        if (task.status === "Visited") visited_count++;
        if (task.status === "Pending") pending_count++;
    });

    total_element.textContent = tasks.length;
    pending_element.textContent = pending_count;
    visited_element.textContent = visited_count;
}