/* =====================================================
   FITGENIUS — COMPLETE JAVASCRIPT
   GLASS V2.2 + SUPABASE AUTHENTICATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       1. GLOBAL ELEMENTS
    ========================================= */

    const header = document.getElementById("header");
    const currentYear = document.getElementById("currentYear");
    const dashboardYear = document.getElementById("dashboardYear");

    const year = new Date().getFullYear();

    if (currentYear) currentYear.textContent = year;
    if (dashboardYear) dashboardYear.textContent = year;


    /* =========================================
       2. SUPABASE CLIENT
    ========================================= */

    const supabaseClient = window.fitgeniusSupabase || null;


    /* =========================================
       3. MOBILE NAVIGATION
    ========================================= */

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", function () {

            navigation.classList.toggle("active");

            const isOpen = navigation.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", isOpen);

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.className = isOpen
                    ? "fa-solid fa-xmark"
                    : "fa-solid fa-bars";
            }

        });

        navigation.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                const icon = menuToggle.querySelector("i");

                if (icon) icon.className = "fa-solid fa-bars";

            });

        });

    }


    /* =========================================
       4. HEADER SCROLL EFFECT
    ========================================= */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", updateHeader);
    updateHeader();


    /* =========================================
       5. SMOOTH SCROLLING
    ========================================= */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

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
       6. SCROLL REVEAL ANIMATIONS
    ========================================= */

    const revealElements = document.querySelectorAll(
        ".feature-card, .step-card, .about-content, .about-visual, .cta-container"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, observerInstance) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        observerInstance.unobserve(entry.target);

                    }

                });

            },
            { threshold: 0.12 }
        );

        revealElements.forEach(function (element) {

            element.classList.add("reveal");

            observer.observe(element);

        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("revealed");
        });

    }


    /* =========================================
       7. PASSWORD VISIBILITY
    ========================================= */

    document.querySelectorAll(".password-toggle").forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = this.getAttribute("data-target");

            const passwordField = document.getElementById(targetId);

            if (!passwordField) return;

            const isPassword = passwordField.type === "password";

            passwordField.type = isPassword ? "text" : "password";

            const icon = this.querySelector("i");

            if (icon) {

                icon.className = isPassword
                    ? "fa-solid fa-eye-slash"
                    : "fa-solid fa-eye";

            }

        });

    });


    /* =========================================
       8. MESSAGE DISPLAY FUNCTION
    ========================================= */

    function showMessage(element, message, type) {

        if (!element) return;

        element.textContent = message;
        element.style.display = "block";

        if (type === "success") {
            element.style.color = "#9cff57";
        } else {
            element.style.color = "#ff647c";
        }

    }


    /* =========================================
       9. REGISTRATION — SUPABASE AUTH
    ========================================= */

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const firstName = document.getElementById("firstName");
            const lastName = document.getElementById("lastName");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirmPassword = document.getElementById("confirmPassword");
            const terms = document.getElementById("terms");
            const message = document.getElementById("registerMessage");

            const submitButton = registerForm.querySelector(
                'button[type="submit"]'
            );

            if (
                !firstName ||
                !lastName ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    message,
                    "Registration form is incomplete.",
                    "error"
                );

                return;

            }

            if (
                !firstName.value.trim() ||
                !lastName.value.trim() ||
                !email.value.trim() ||
                !password.value ||
                !confirmPassword.value
            ) {

                showMessage(
                    message,
                    "Please complete all required fields.",
                    "error"
                );

                return;

            }

            if (!email.validity.valid) {

                showMessage(
                    message,
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }

            if (password.value.length < 8) {

                showMessage(
                    message,
                    "Your password must contain at least 8 characters.",
                    "error"
                );

                return;

            }

            if (password.value !== confirmPassword.value) {

                showMessage(
                    message,
                    "Your passwords do not match.",
                    "error"
                );

                return;

            }

            if (terms && !terms.checked) {

                showMessage(
                    message,
                    "Please accept the Terms and Conditions.",
                    "error"
                );

                return;

            }

            if (!supabaseClient) {

                showMessage(
                    message,
                    "Connection error. Please refresh the page and try again.",
                    "error"
                );

                console.error("Supabase client is not available.");

                return;

            }

            const originalButtonContent = submitButton
                ? submitButton.innerHTML
                : "";

            if (submitButton) {

                submitButton.disabled = true;
                submitButton.textContent = "Creating your account...";

            }

            try {

                const { data, error } = await supabaseClient.auth.signUp({

                    email: email.value.trim(),

                    password: password.value,

                    options: {

                        data: {
                            first_name: firstName.value.trim(),
                            last_name: lastName.value.trim()
                        },

                        emailRedirectTo: new URL(
                            "login.html",
                            window.location.href
                        ).href

                    }

                });

                if (error) {
                    throw error;
                }

                if (data.session) {

                    showMessage(
                        message,
                        "Your account has been created successfully! Redirecting...",
                        "success"
                    );

                    setTimeout(function () {
                        window.location.href = "dashboard.html";
                    }, 1500);

                } else {

                    showMessage(
                        message,
                        "Your account has been created! Please check your email and click the verification link before signing in.",
                        "success"
                    );

                    registerForm.reset();

                }

            } catch (error) {

                console.error("Registration error:", error);

                let errorMessage = error.message ||
                    "Unable to create your account. Please try again.";

                if (
                    error.message &&
                    error.message.toLowerCase().includes("already registered")
                ) {

                    errorMessage =
                        "This email is already registered. Please sign in instead.";

                }

                showMessage(message, errorMessage, "error");

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonContent;

                }

            }

        });

    }


    /* =========================================
       10. LOGIN FORM
       LOGIN CONNECTION WILL BE COMPLETED NEXT
    ========================================= */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email = document.getElementById("loginEmail");
            const password = document.getElementById("loginPassword");
            const message = document.getElementById("loginMessage");

            if (!email || !password) {

                showMessage(
                    message,
                    "Login form is incomplete.",
                    "error"
                );

                return;

            }

            if (!email.value.trim() || !password.value) {

                showMessage(
                    message,
                    "Please enter your email and password.",
                    "error"
                );

                return;

            }

            showMessage(
                message,
                "Your login form is ready. We'll connect sign-in next.",
                "success"
            );

        });

    }


    /* =========================================
       11. FORGOT PASSWORD
    ========================================= */

    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {

        forgotPassword.addEventListener("click", async function (event) {

            event.preventDefault();

            const email = document.getElementById("loginEmail");
            const message = document.getElementById("loginMessage");

            if (!email || !email.value.trim()) {

                showMessage(
                    message,
                    "Enter your email address first.",
                    "error"
                );

                return;

            }

            if (!email.validity.valid) {

                showMessage(
                    message,
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }

            if (!supabaseClient) {

                showMessage(
                    message,
                    "Authentication is not connected yet.",
                    "error"
                );

                return;

            }

            try {

                const { error } =
                    await supabaseClient.auth.resetPasswordForEmail(
                        email.value.trim(),
                        {
                            redirectTo: new URL(
                                "login.html",
                                window.location.href
                            ).href
                        }
                    );

                if (error) throw error;

                showMessage(
                    message,
                    "If an account exists for this email, a password recovery link will be sent.",
                    "success"
                );

            } catch (error) {

                console.error("Password recovery error:", error);

                showMessage(
                    message,
                    error.message || "Unable to send the recovery email.",
                    "error"
                );

            }

        });

    }


    /* =========================================
       12. DASHBOARD MOBILE SIDEBAR
    ========================================= */

    const dashboardMenuToggle =
        document.getElementById("dashboardMenuToggle");

    const dashboardSidebar =
        document.getElementById("dashboardSidebar");

    if (dashboardMenuToggle && dashboardSidebar) {

        dashboardMenuToggle.addEventListener("click", function () {

            dashboardSidebar.classList.toggle("active");

            const icon = dashboardMenuToggle.querySelector("i");

            if (icon) {

                icon.className =
                    dashboardSidebar.classList.contains("active")
                    ? "fa-solid fa-xmark"
                    : "fa-solid fa-bars";

            }

        });

        dashboardSidebar.querySelectorAll(".sidebar-link").forEach(
            function (link) {

                link.addEventListener("click", function () {

                    dashboardSidebar.classList.remove("active");

                    dashboardSidebar.querySelectorAll(".sidebar-link")
                        .forEach(function (item) {
                            item.classList.remove("active");
                        });

                    this.classList.add("active");

                });

            }
        );

    }


    /* =========================================
       13. DASHBOARD DATE
    ========================================= */

    const dashboardDate = document.getElementById("dashboardDate");

    if (dashboardDate) {

        const today = new Date();

        dashboardDate.textContent = today.toLocaleDateString("en-US", {

            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"

        });

    }


    /* =========================================
       14. DASHBOARD TOAST MESSAGE
    ========================================= */

    function showDashboardMessage(message) {

        let toast = document.getElementById("dashboardToast");

        if (!toast) {

            toast = document.createElement("div");

            toast.id = "dashboardToast";

            toast.style.position = "fixed";
            toast.style.bottom = "25px";
            toast.style.right = "25px";
            toast.style.zIndex = "9999";

            toast.style.padding = "15px 22px";
            toast.style.borderRadius = "14px";

            toast.style.background = "#10251b";
            toast.style.border = "1px solid rgba(156,255,87,.4)";

            toast.style.color = "#9cff57";
            toast.style.fontSize = "14px";

            toast.style.boxShadow = "0 10px 35px rgba(0,0,0,.3)";

            document.body.appendChild(toast);

        }

        toast.textContent = message;
        toast.style.display = "block";

        clearTimeout(window.fitGeniusToastTimer);

        window.fitGeniusToastTimer = setTimeout(function () {
            toast.style.display = "none";
        }, 3500);

    }


    /* =========================================
       15. DASHBOARD NOTIFICATIONS
    ========================================= */

    const notificationButton =
        document.getElementById("notificationButton");

    if (notificationButton) {

        notificationButton.addEventListener("click", function () {

            showDashboardMessage(
                "You have no new notifications yet."
            );

        });

    }


    /* =========================================
       16. SETTINGS — LOCAL STORAGE
    ========================================= */

    const profileForm = document.getElementById("profileForm");

    const saveSettings = document.getElementById("saveSettings");

    const settingsMessage =
        document.getElementById("settingsMessage");

    const notificationOptions = [
        "activityNotifications",
        "sleepNotifications",
        "wellnessNotifications"
    ];

    function getSavedSettings() {

        try {

            return JSON.parse(
                localStorage.getItem("fitgeniusSettings") || "{}"
            );

        } catch (error) {

            return {};

        }

    }

    function saveSettingsToStorage(settings) {

        try {

            localStorage.setItem(
                "fitgeniusSettings",
                JSON.stringify(settings)
            );

            return true;

        } catch (error) {

            return false;

        }

    }


    /* LOAD SAVED PROFILE SETTINGS */

    const savedSettings = getSavedSettings();

    if (profileForm) {

        const profileFields = [
            "profileFirstName",
            "profileLastName",
            "profileEmail",
            "profileAge"
        ];

        profileFields.forEach(function (id) {

            const field = document.getElementById(id);

            if (field && savedSettings[id] !== undefined) {
                field.value = savedSettings[id];
            }

        });

    }


    /* LOAD NOTIFICATION PREFERENCES */

    notificationOptions.forEach(function (id) {

        const checkbox = document.getElementById(id);

        if (checkbox && savedSettings[id] !== undefined) {
            checkbox.checked = savedSettings[id];
        }

    });


    /* SAVE PROFILE INFORMATION */

    if (profileForm) {

        profileForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const firstName =
                document.getElementById("profileFirstName");

            const lastName =
                document.getElementById("profileLastName");

            const email =
                document.getElementById("profileEmail");

            const age =
                document.getElementById("profileAge");

            if (!firstName || !lastName || !email || !age) return;

            if (
                !firstName.value.trim() ||
                !lastName.value.trim() ||
                !email.value.trim()
            ) {

                showMessage(
                    settingsMessage,
                    "Please complete all required fields.",
                    "error"
                );

                return;

            }

            if (!email.validity.valid) {

                showMessage(
                    settingsMessage,
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }

            if (
                age.value &&
                (
                    Number(age.value) < 13 ||
                    Number(age.value) > 120 ||
                    !Number.isFinite(Number(age.value))
                )
            ) {

                showMessage(
                    settingsMessage,
                    "Please enter a valid age.",
                    "error"
                );

                return;

            }

            const settings = getSavedSettings();

            settings.profileFirstName = firstName.value.trim();
            settings.profileLastName = lastName.value.trim();
            settings.profileEmail = email.value.trim();
            settings.profileAge = age.value;

            if (saveSettingsToStorage(settings)) {

                showMessage(
                    settingsMessage,
                    "Your profile information has been saved!",
                    "success"
                );

            } else {

                showMessage(
                    settingsMessage,
                    "Unable to save settings in this browser.",
                    "error"
                );

            }

        });

    }


    /* SAVE NOTIFICATION PREFERENCES */

    if (saveSettings) {

        saveSettings.addEventListener("click", function () {

            const settings = getSavedSettings();

            notificationOptions.forEach(function (id) {

                const checkbox = document.getElementById(id);

                if (checkbox) {
                    settings[id] = checkbox.checked;
                }

            });

            if (saveSettingsToStorage(settings)) {

                showMessage(
                    settingsMessage,
                    "Your preferences have been saved!",
                    "success"
                );

            } else {

                showMessage(
                    settingsMessage,
                    "Unable to save your preferences.",
                    "error"
                );

            }

        });

    }


    /* =========================================
       17. GENERAL INITIALIZATION
    ========================================= */

    console.log("FitGenius initialized successfully!");

});
