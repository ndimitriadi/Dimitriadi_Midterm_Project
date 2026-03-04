//--------------------TESTIMONIALS--------------------------------------------------------

  //grabs all testimonials items
  const carousel = document.querySelector('.carousel');
  const carousel_track = document.querySelector('.carousel-track');
  const next_button = document.querySelector('.next');
  const previous_button = document.querySelector('.prev');
  const carousel_dots = document.querySelector('.carousel-dots');

  //cards converted to an array to use array methods (like slice)
  let cards = Array.from(document.querySelectorAll('.card'));

  let index = 0; //keeps track of which card is currently on the left
  let auto_play; //stores set_interval for autoplay
  const auto_play_time = 6000; //auto-slide time (6seconds)

  // mobile
  function cards_number() {
    const width = window.innerWidth;
    if (width <= 900) {
        return 1;              
    } else 
        return 3;       
    } 
    /*window.innerWidth checks width of the browser window
    if the window is 900 pixels or less, one card is shown
    else 3 cards are shown*/


  // infinite loop 
  function creating_clones() { 
    const visible_cards = cards_number(); 
    /*sees how many cards are visible, if we are on mobile or not
    determines how many clones we need*/

    const first_cards_clones = cards.slice(0, visible_cards).map(card => card.cloneNode(true)); 
    //cloneNode(true) copies the element and its child elements (stars, quote, author)
    //takes the first visible_cards cards, clones them and will add them to the end

    const last_cards_clones = cards.slice(-visible_cards).map(card => card.cloneNode(true));
    //takes the last visible_cards cards, clones them and will add them to the front

    last_cards_clones.forEach(clone => carousel_track.insertBefore(clone, carousel_track.firstChild));
    first_cards_clones.forEach(clone => carousel_track.appendChild(clone));

    /*re-selects all card elements and covert the NodeList into an array,
    so now cards include the original and the cloned cards*/
    cards = Array.from(document.querySelectorAll('.card'));

    //setting starting index so that it skips the cloned cards
    index = visible_cards;

    update_carousel(false);
  }

  //ensures seamless carousel loops
  /*after a slide animation ends (transitionend) it checks if we are on a cloned card
  if yes: goes to an original cards*/
  carousel_track.addEventListener('transitionend', () => {
    const visible_cards = cards_number();
    const totalCards = cards.length;
    if (index >= totalCards - visible_cards) {
      index = visible_cards;
      update_carousel(false); //disables animation
    }
    if (index < visible_cards) {
      index = totalCards - (visible_cards * 2);
      update_carousel(false);
    }
  });

  // update card position 
  function update_carousel(animate = true) {
    const cardWidth = cards[0].offsetWidth;
   
    if (animate) {
          carousel_track.style.transition = 'transform 0.5s ease';
    } else {
      carousel_track.style.transition = 'none';
    }
    
    carousel_track.style.transform = `translateX(-${index * cardWidth}px)`; //calculates how far it slides
    update_dots();
  }

  // controls index 
  function next_slide() {
    index++;
    update_carousel();
  }

  function previous_slide() {
    index--;
    update_carousel();
  }

  //dots
  function dots() {
    const real_cards = 6;
    carousel_dots.innerHTML = '';
    for (let i = 0; i < real_cards; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.addEventListener('click', () => {
        index = i + cards_number();
        update_carousel();
        restart_autoplay();
      });
      carousel_dots.appendChild(dot);
    }
  }

  function update_dots() { //highlights the active dot based on the index
    const dots = document.querySelectorAll('.dot');
    const visible_cards = cards_number();
    let real_index = (index - visible_cards) % dots.length;
    if (real_index < 0){
      real_index = real_index + dots.length;
    }

    //removes active class from all dots and puts it in the correct one
    dots.forEach(function(dot) {
      dot.classList.remove('active');
    });
    if (dots[real_index]) {
      dots[real_index].classList.add('active');
    }
  }

  //autoplay
  function start_autoplay() {
    auto_play = setInterval(() => {next_slide();}, auto_play_time);
  }
  function stop_autoplay() {
    clearInterval(auto_play);
  }
  function restart_autoplay() {
    stop_autoplay();
    start_autoplay();
  }

  //Pause on hover 
  carousel.addEventListener('mouseenter', stop_autoplay);
  carousel.addEventListener('mouseleave', start_autoplay);

  // Pause on arrow click and restart autoplay
  next_button.addEventListener('click', () => {
    next_slide();
    restart_autoplay();
  });
  previous_button.addEventListener('click', () => {
    previous_slide();
    restart_autoplay();
  });

  //when resizing the window it reloads the page to recalculate the cards per view and clones
  window.addEventListener('resize', () => location.reload());

  //initialization
  creating_clones();
  dots();
  start_autoplay();


//----------------------------LATEST ACTIVITY------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const recent_tasks_grid = document.querySelector("#recent-tasks-grid");
  const saved_tasks = JSON.parse(localStorage.getItem("tasks")) || []; //gets stored tasks as a string or an empty array

  recent_tasks_grid.innerHTML = "";

  //no tasks message
  if (saved_tasks.length === 0) { 
    recent_tasks_grid.innerHTML = `
      <div class="empty_table_index">
          <i class="bi bi-bookmark-star" aria-hidden="true"></i>
          <p>No places added yet.  Head to your favorites to get started!</p>
      </div>    
    `;
    return;
  }

  //display low, medium, high values like optional,maybe,must visit
  function format_priority(priority) {
    if (priority === "low") return "Optional";
    if (priority === "medium") return "Maybe";
    if (priority === "high") return "Must Visit";
    return priority;
  }

  //gets only 3 latest tasks
  const latest_tasks = saved_tasks.slice(-3).reverse();

  //for every task we create a new card
  latest_tasks.forEach(task => { 
    const card = document.createElement("div");
    card.classList.add("recent-task-card");

    card.innerHTML = `
      <i class="bi bi-geo-alt" aria-hidden="true"></i> ${task.place}
      <p><strong>Priority:</strong> 
          <span>${format_priority(task.priority)}</span>
      </p>
      <p><strong>Date:</strong> ${task.date}</p>
      <span class="status-badge status-${task.status}">
          ${task.status}
      </span>
    `;

    //adds it to the page
    recent_tasks_grid.appendChild(card);
  });
});


//-------------------------DASHBOARD--------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const saved_tasks_d = JSON.parse(localStorage.getItem("tasks")) || [];
  const status_chart = document.querySelector(".status-chart");
  const priority_chart = document.querySelector(".priority-chart");
  const charts_grid = document.querySelector(".charts-grid");

  if (saved_tasks_d.length === 0) {
    
    //no tasks message
    charts_grid.style.display = "block";
    charts_grid.innerHTML = `
      <div class="empty_table_index">
          <i class="bi bi-pie-chart" aria-hidden="true"></i>
          <p>No data to display yet.  Add some places to your favorites to see your culinary stats!</p>
      </div>
    `;

  } else {

    //counting
    let pending = 0, visited = 0;
    let high = 0, medium = 0, low = 0;

    saved_tasks_d.forEach(task => {
      if (task.status === "Pending") pending++;
      if (task.status === "Visited") visited++;

      const priority = task.priority;
      if (priority === "high") high++;
      if (priority === "medium") medium++;
      if (priority === "low") low++;
    });

    //status chart
    new Chart(status_chart, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Visited'],
        datasets: [{
          data: [pending, visited],
          backgroundColor: ['#f39c12', '#2ecc71'],
          borderWidth: 0 
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#888' } },
          title: { display: true, text: 'Visit Status', color: '#888' }
        }
      }
    });

    // priority chart
    new Chart(priority_chart, {
      type: 'pie',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          label: 'Places',
          data: [high, medium, low],
          backgroundColor: ['#e74c3c', '#f39c12', '#2ecc71'], 
          borderWidth: 0 
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#888' }}, 
          title: { display: true, text: 'Places by Priority', color: '#888' }
        }
      }
    });
  }
});