//--------------------- LOADING HEADER ----------------------------------
const header_placeholder = document.querySelector('#header-placeholder');

fetch('header.html')
.then(response => {
    return response.text();
})

.then(data => {
    header_placeholder.innerHTML = data;

    highlight_active_link();
    hamburger_menu();
    });
        

//-------------- HIGHLIGHT ACTIVE LINK --------------------------------------
function highlight_active_link(){
    const current_window_location = window.location.href; 
    const all_nav_links = document.querySelectorAll('.nav-links a, .mobile-dropdown a');
    
    all_nav_links.forEach(link => {
        if (link.href === current_window_location) {
            link.classList.add('active'); 
        }
    });
}

//----------------------- HAMBURGER MENU -----------------------------------
function hamburger_menu(){
    const hamburger_button = document.querySelector('.hamburger-button');
    const mobile_dropdown = document.querySelector('.mobile-dropdown');

    hamburger_button.addEventListener('click', () => {
        mobile_dropdown.classList.toggle('active');
        hamburger_button.classList.toggle('open');
        
        //animation
        const spans = hamburger_button.querySelectorAll('span');
        if (hamburger_button.classList.contains('open')) {
            spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
            spans[1].style.opacity = "0";
            spans[2].style.transform = "rotate(-45deg) translate(4px, -4px)";
        } else {
            spans[0].style.transform = "none";
            spans[1].style.opacity = "1";
            spans[2].style.transform = "none";
        }
        })
}
            

//----------- LOADING FOOTER----------------------------------------------------

//we send a request for footer.html and we get an object 'response'. In order to be a able to read it we 'response.text()'
//then we data contains the actual HTML string
const footer_placeholder = document.querySelector('#footer-placeholder');

fetch('footer.html')
    .then(response => {
        return response.text();
    })
    .then(data => {
        footer_placeholder.innerHTML = data;
    })


/*-------------- DARK MODE -------------------------------------*/

class dark_mode extends HTMLElement {
  connectedCallback() { //executes as soon as <dark-mode-toggle> is on the page

    this.innerHTML = `
      <button id="theme-toggle" aria-label="Toggle dark mode">
        <i id="theme-icon" class="bi bi-moon-fill" aria-hidden="true"></i>
      </button>
    `;

    //storing elements
    this.theme_toggle = this.querySelector("#theme-toggle");
    this.icon = this.querySelector("#theme-icon");
    this.htmlElement = document.documentElement;

    //checks if we have previously selected a theme
    const saved_theme = localStorage.getItem("theme") || "light";
    this.htmlElement.setAttribute("data-theme", saved_theme);
    this.update_icon(saved_theme);

    this.theme_toggle.addEventListener("click", () => {
        const current_theme = this.htmlElement.getAttribute("data-theme");
        let new_theme;

        if (current_theme === "dark") {
            new_theme = "light";
        } else {
            new_theme = "dark";
        }

        this.htmlElement.setAttribute("data-theme", new_theme);
        localStorage.setItem("theme", new_theme);
        this.update_icon(new_theme);
    });
  }

    update_icon(theme) {
        if (theme === "dark") {
            this.icon.className="bi bi-moon-fill";
        } else {
            this.icon.className="bi bi-sun-fill";
        }
    }
}

customElements.define('dark-mode-toggle', dark_mode);


/*--------------- BACK TO TOP BUTTON-----------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    const back_to_top = document.querySelector('#back-to-top');
    if (back_to_top) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 800) {
                back_to_top.classList.add('show');
            } else {
                back_to_top.classList.remove('show');
            }
        });

        back_to_top.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        });
    }
});