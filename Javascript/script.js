/* loads header and hamburger */
    const headerPlaceholder = document.querySelector('#header-placeholder');
    
    if (headerPlaceholder) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error("Could not load header");
                return response.text();
            })
    
            .then(data => {
                headerPlaceholder.innerHTML = data;

                /*highlighting active page link*/
                const currentLocation = window.location.href; 
                const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-dropdown a');
                
                allNavLinks.forEach(link => {
                    if (link.href === currentLocation) {
                        link.classList.add('active'); 
                    }
                });
                /*-----------------------------*/

                /* Hamburger Menu*/ 
                const menuBtn = document.querySelector('.hamburger-btn');
                const dropdown = document.querySelector('.mobile-dropdown');

                if (menuBtn && dropdown) {
                    menuBtn.addEventListener('click', () => {
                        dropdown.classList.toggle('active');
                        menuBtn.classList.toggle('open');
                        
                        const spans = menuBtn.querySelectorAll('span');
                        if (menuBtn.classList.contains('open')) {
                            spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                            spans[1].style.opacity = "0";
                            spans[2].style.transform = "rotate(-45deg) translate(4px, -4px)";
                        } else {
                            spans[0].style.transform = "none";
                            spans[1].style.opacity = "1";
                            spans[2].style.transform = "none";
                        }
                    });
                }
            })
            .catch(error => console.error("Error loading header:", error));
    }


/* load footer */
    const footerPlaceholder = document.querySelector('#footer-placeholder');
    
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error("Could not load footer");
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error("Error loading footer:", error));
    }



/*-----DARK MODE -------------------------------------*/

class DarkMode extends HTMLElement {
  connectedCallback() {

    this.innerHTML = `
      <button id="theme-toggle" aria-label="Toggle dark mode">
        <i id="theme-icon" class="bi bi-moon-fill" aria-hidden="true"></i>
      </button>
    `;

    this.toggleBtn = this.querySelector("#theme-toggle");
    this.icon = this.querySelector("#theme-icon");
    this.htmlElement = document.documentElement;


    const savedTheme = localStorage.getItem("theme") || "light";
    this.htmlElement.setAttribute("data-theme", savedTheme);
    this.updateIcon(savedTheme);

    this.toggleBtn.addEventListener("click", () => {
      const currentTheme = this.htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      this.htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      this.updateIcon(newTheme);
    });
  }

  updateIcon(theme) {
    this.icon.className = theme === "dark" 
      ? "bi bi-moon-fill" 
      : "bi bi-sun-fill";
  }
}


customElements.define('dark-mode-toggle', DarkMode);


/*-----------------------------------------------------*/


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