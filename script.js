/* =========================================
   FITGENIUS — MAIN JAVASCRIPT
   GLASS V2.2
========================================= */


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {

    menuToggle.addEventListener("click", () => {

        navigation.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }

    });


    // Close menu after clicking a navigation link

    navigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navigation.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });

    });

}


/* =========================================
   DYNAMIC FOOTER YEAR
========================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================
   HEADER SCROLL EFFECT
========================================= */

const header = document.getElementById("header");

if (header) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.style.background = "rgba(5, 11, 20, 0.92)";
            header.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)";

        } else {

            header.style.background = "rgba(5, 11, 20, 0.68)";
            header.style.boxShadow = "none";

        }

    });

}


/* =========================================
   SMOOTH SCROLLING
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(event) {

        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


/* =========================================
   REVEAL ANIMATIONS
========================================= */

const revealElements = document.querySelectorAll(
    ".feature-card, .step-card, .about-content, .about-visual, .cta-container"
);

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("revealed");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });


    revealElements.forEach(element => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

}


/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("FitGenius initialized successfully!");

});
/* =========================================
   FITGENIUS — REGISTRATION FUNCTIONALITY
========================================= */

// SHOW / HIDE PASSWORD

document.querySelectorAll(".password-toggle").forEach(button => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.target;
        const passwordInput = document.getElementById(targetId);

        if (!passwordInput) return;

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        button.innerHTML = isPassword
            ? '<i class="fa-solid fa-eye-slash"></i>'
            : '<i class="fa-solid fa-eye"></i>';
    });
});


// REGISTRATION FORM VALIDATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terms = document.getElementById("terms");
        const message = document.getElementById("registerMessage");

        message.textContent = "";
        message.style.color = "#ff7070";

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            message.textContent = "Please complete all fields.";
            return;
        }

        if (password.length < 8) {
            message.textContent = "Password must contain at least 8 characters.";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Your passwords do not match.";
            return;
        }

        if (!terms.checked) {
            message.textContent = "Please accept the terms and conditions.";
            return;
        }

        message.style.color = "#9cff57";
        message.textContent =
            "Your details are valid! Account creation will be available when secure authentication is connected.";

        console.log("FitGenius registration form validated.");
    });
}
/* =========================================
   FITGENIUS — LOGIN FUNCTIONALITY
========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        message.style.color = "#ff7070";
        message.textContent = "";

        if (!email || !password) {
            message.textContent = "Please enter your email and password.";
            return;
        }

        if (password.length < 8) {
            message.textContent = "Please enter a valid password.";
            return;
        }

        message.style.color = "#9cff57";

        message.textContent =
            "Your details are valid. Secure login will be available after authentication setup.";

        console.log("FitGenius login form validated.");

    });

}


// FORGOT PASSWORD INTERACTION

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", function(event) {

        event.preventDefault();

        const message = document.getElementById("loginMessage");

        message.style.color = "#45d7ff";

        message.textContent =
            "Password recovery will be available after Supabase integration.";

    });

}

