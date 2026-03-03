/*---------------CONTACT US CONFIRMATION WINDOW ------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.querySelector("#contactForm");
    const contactWindow = document.querySelector("#contact_window");
    const contactDetails = document.querySelector("#contact_details");
    const closeWindow = document.querySelector("#close_window");


    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const firstName = contactForm.querySelector('input[name="first_name"]').value;
        const lastName = contactForm.querySelector('input[name="last_name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const subject = contactForm.querySelector('input[name="subject"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;

        contactDetails.innerHTML = `
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
        `;

        contactWindow.style.display = "flex";
        contactForm.reset();
    });


    // Close button
    if (closeWindow) {
        closeWindow.addEventListener("click", () => {
            contactWindow.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === contactWindow) {
            contactWindow.style.display = "none";
        }
    });
});