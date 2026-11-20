/* =====================================================
   FITGENIUS — COMPLETE JAVASCRIPT
   GLASS V2.3 + SUPABASE AUTH + FITNESS TRACKING
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       1. SUPABASE CONNECTION
    ========================================= */

    const supabaseClient = window.fitgeniusSupabase || null;

    function requireSupabase(messageElement) {
        if (!supabaseClient) {
            showMessage(
                messageElement,
                "Authentication service is unavailable. Please refresh the page.",
                "error"
            );
            return false;
        }

        return true;
    }


    /* =========================================
       2. GLOBAL ELEMENTS
    ========================================= */

    const header = document.getElementById("header");
    const currentYear = document.getElementById("currentYear");
    const dashboardYear = document.getElementById("dashboardYear");

    const year = new Date().getFullYear();

    if (currentYear) currentYear.textContent = year;
    if (dashboardYear) dashboardYear.textContent = year;


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

        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 40);
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

            this.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );

        });

    });


    /* =========================================
       8. MESSAGE DISPLAY
    ========================================= */

    function showMessage(element, message, type) {

        if (!element) return;

        element.textContent = message;
        element.style.display = "block";

        element.style.color = type === "success"
            ? "#9cff57"
            : "#ff647c";

    }


    /* =========================================
       9. REGISTRATION — SUPABASE
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
            const submitButton = registerForm.querySelector('[type="submit"]');

            if (!requireSupabase(message)) return;

            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showMessage(message, "Registration form is incomplete.", "error");
                return;
            }

            if (
                !firstName.value.trim() ||
                !lastName.value.trim() ||
                !email.value.trim() ||
                !password.value ||
                !confirmPassword.value
            ) {
                showMessage(message, "Please complete all required fields.", "error");
                return;
            }

            if (!email.validity.valid) {
                showMessage(message, "Please enter a valid email address.", "error");
                return;
            }

            if (password.value.length < 8) {
                showMessage(message, "Your password must contain at least 8 characters.", "error");
                return;
            }

            if (password.value !== confirmPassword.value) {
                showMessage(message, "Your passwords do not match.", "error");
                return;
            }

            if (terms && !terms.checked) {
                showMessage(message, "Please accept the Terms and Conditions.", "error");
                return;
            }

            if (submitButton) submitButton.disabled = true;

            showMessage(message, "Creating your FitGenius account...", "success");

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

                if (error) throw error;

                if (data.session) {

                    showMessage(
                        message,
                        "Your account has been created successfully. Redirecting...",
                        "success"
                    );

                    window.location.href = "dashboard.html";

                } else {

                    showMessage(
                        message,
                        "Your account has been created. Please check your email and confirm your address before signing in.",
                        "success"
                    );

                    registerForm.reset();

                }

            } catch (error) {

                console.error("Registration error:", error);

                showMessage(
                    message,
                    error.message || "Unable to create your account. Please try again.",
                    "error"
                );

            } finally {

                if (submitButton) submitButton.disabled = false;

            }

        });

    }


    /* =========================================
       10. LOGIN — SUPABASE
    ========================================= */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const email = document.getElementById("loginEmail");
            const password = document.getElementById("loginPassword");
            const message = document.getElementById("loginMessage");
            const submitButton = loginForm.querySelector('[type="submit"]');

            if (!requireSupabase(message)) return;

            if (!email || !password) {
                showMessage(message, "Login form is incomplete.", "error");
                return;
            }

            if (!email.value.trim() || !password.value) {
                showMessage(message, "Please enter your email and password.", "error");
                return;
            }

            if (!email.validity.valid) {
                showMessage(message, "Please enter a valid email address.", "error");
                return;
            }

            if (submitButton) submitButton.disabled = true;

            showMessage(message, "Signing you in...", "success");

            try {

                const { data, error } =
                    await supabaseClient.auth.signInWithPassword({

                        email: email.value.trim(),
                        password: password.value

                    });

                if (error) throw error;

                if (data.session) {

                    showMessage(
                        message,
                        "Login successful. Opening your dashboard...",
                        "success"
                    );

                    window.location.href = "dashboard.html";

                } else {

                    showMessage(
                        message,
                        "Unable to establish your session. Please try again.",
                        "error"
                    );

                }

            } catch (error) {

                console.error("Login error:", error);

                showMessage(
                    message,
                    error.message || "Login failed. Please check your details.",
                    "error"
                );

            } finally {

                if (submitButton) submitButton.disabled = false;

            }

        });

    }


    /* =========================================
       11. FORGOT PASSWORD
    ========================================= */

    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {

        forgotPassword.addEventListener("click", function (event) {

            event.preventDefault();

            const message = document.getElementById("loginMessage");

            showMessage(
                message,
                "Password recovery is not fully configured yet. We'll add a secure reset page next.",
                "error"
            );

        });

    }


    /* =========================================
       12. DASHBOARD MOBILE SIDEBAR
    ========================================= */

    const dashboardMenuToggle = document.getElementById("dashboardMenuToggle");
    const dashboardSidebar = document.getElementById("dashboardSidebar");

    if (dashboardMenuToggle && dashboardSidebar) {

        dashboardMenuToggle.addEventListener("click", function () {

            dashboardSidebar.classList.toggle("active");

            const icon = dashboardMenuToggle.querySelector("i");

            if (icon) {

                icon.className = dashboardSidebar.classList.contains("active")
                    ? "fa-solid fa-xmark"
                    : "fa-solid fa-bars";

            }

        });

        dashboardSidebar.querySelectorAll(".sidebar-link").forEach(function (link) {

            link.addEventListener("click", function () {

                dashboardSidebar.classList.remove("active");

                dashboardSidebar.querySelectorAll(".sidebar-link").forEach(function (item) {
                    item.classList.remove("active");
                });

                this.classList.add("active");

            });

        });

    }


    /* =========================================
       13. DASHBOARD DATE
    ========================================= */

    const dashboardDate = document.getElementById("dashboardDate");

    if (dashboardDate) {

        dashboardDate.textContent = new Date().toLocaleDateString("en-US", {
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

    const notificationButton = document.getElementById("notificationButton");

    if (notificationButton) {

        notificationButton.addEventListener("click", function () {
            showDashboardMessage("You have no new notifications yet.");
        });

    }


    /* =========================================
       16. SETTINGS — LOCAL STORAGE
    ========================================= */

    const profileForm = document.getElementById("profileForm");
    const saveSettings = document.getElementById("saveSettings");
    const settingsMessage = document.getElementById("settingsMessage");

    const notificationOptions = [
        "activityNotifications",
        "sleepNotifications",
        "wellnessNotifications"
    ];

    function getSavedSettings() {

        try {
            return JSON.parse(localStorage.getItem("fitgeniusSettings") || "{}");
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

    const savedSettings = getSavedSettings();

    if (profileForm) {

        [
            "profileFirstName",
            "profileLastName",
            "profileEmail",
            "profileAge"
        ].forEach(function (id) {

            const field = document.getElementById(id);

            if (field && savedSettings[id] !== undefined) {
                field.value = savedSettings[id];
            }

        });

    }

    notificationOptions.forEach(function (id) {

        const checkbox = document.getElementById(id);

        if (checkbox && savedSettings[id] !== undefined) {
            checkbox.checked = savedSettings[id];
        }

    });


    /* =========================================
       17. SAVE PROFILE INFORMATION
    ========================================= */

    if (profileForm) {

        profileForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const firstName = document.getElementById("profileFirstName");
            const lastName = document.getElementById("profileLastName");
            const email = document.getElementById("profileEmail");
            const age = document.getElementById("profileAge");

            if (!firstName || !lastName || !email || !age) return;

            if (
                !firstName.value.trim() ||
                !lastName.value.trim() ||
                !email.value.trim()
            ) {

                showMessage(settingsMessage, "Please complete all required fields.", "error");
                return;

            }

            if (!email.validity.valid) {

                showMessage(settingsMessage, "Please enter a valid email address.", "error");
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

                showMessage(settingsMessage, "Please enter a valid age.", "error");
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


    /* =========================================
       18. SAVE NOTIFICATION PREFERENCES
    ========================================= */

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
       19. FITNESS TRACKING SYSTEM
    ========================================= */

    function initializeFitnessTracking(userId) {

        const activityForm = document.getElementById("activityForm");
        const sleepForm = document.getElementById("sleepForm");

        if (!activityForm && !sleepForm) return;

        const stepsInput = document.getElementById("stepsInput");
        const activityMinutes = document.getElementById("activityMinutes");

        const sleepHours = document.getElementById("sleepHours");
        const sleepDate = document.getElementById("sleepDate");

        const activityMessage = document.getElementById("activityMessage");
        const sleepMessage = document.getElementById("sleepMessage");

        const stepsValue = document.getElementById("stepsValue");
        const distanceValue = document.getElementById("distanceValue");
        const caloriesValue = document.getElementById("caloriesValue");
        const sleepValue = document.getElementById("sleepValue");

        const recoveryContent = document.getElementById("recoveryContent");

        const stepsProgressText = document.getElementById("stepsProgressText");
        const stepsProgressBar = document.getElementById("stepsProgressBar");

        const sleepProgressText = document.getElementById("sleepProgressText");
        const sleepProgressBar = document.getElementById("sleepProgressBar");

        const progressMessage = document.getElementById("progressMessage");

        const today = getLocalDateKey();

        const storageKey = "fitgeniusTracking_" + userId;

        let records = {};

        /* LOAD SAVED RECORDS */

        function loadRecords() {

            try {

                const stored = localStorage.getItem(storageKey);

                records = stored ? JSON.parse(stored) : {};

                if (
                    !records ||
                    typeof records !== "object" ||
                    Array.isArray(records)
                ) {
                    records = {};
                }

            } catch (error) {

                console.error("Tracking storage error:", error);

                records = {};

            }

        }


        /* SAVE RECORDS */

        function saveRecords() {

            try {

                localStorage.setItem(
                    storageKey,
                    JSON.stringify(records)
                );

                return true;

            } catch (error) {

                console.error("Unable to save tracking records:", error);

                return false;

            }

        }


        /* LOCAL DATE */

        function getLocalDateKey(date = new Date()) {

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}`;

        }


        /* GET TODAY'S RECORD */

        function getTodayRecord() {

            if (!records[today]) {

                records[today] = {
                    steps: 0,
                    minutes: 0,
                    sleep: null,
                    updatedAt: null
                };

            }

            return records[today];

        }


        /* FORMAT NUMBERS */

        function formatNumber(value) {

            return Number(value || 0).toLocaleString("en-US");

        }


        /* UPDATE DASHBOARD */

        function updateDashboard() {

            const record = getTodayRecord();

            const steps = Number(record.steps) || 0;
            const minutes = Number(record.minutes) || 0;

            const sleep = Number(record.sleep) || 0;

            /* DISTANCE ESTIMATE */

            const distance = steps * 0.000762;

            /* APPROXIMATE CALORIES */

            const calories = Math.round(steps * 0.04);

            if (stepsValue) {
                stepsValue.textContent = formatNumber(steps);
            }

            if (distanceValue) {
                distanceValue.textContent = distance.toFixed(2) + " km";
            }

            if (caloriesValue) {
                caloriesValue.textContent = formatNumber(calories) + " kcal";
            }

            if (sleepValue) {
                sleepValue.textContent = sleep > 0
                    ? sleep.toFixed(1) + " hrs"
                    : "0 hrs";
            }


            /* STEPS PROGRESS */

            const stepGoal = 8000;

            const stepPercentage = Math.min(
                (steps / stepGoal) * 100,
                100
            );

            if (stepsProgressText) {

                stepsProgressText.textContent =
                    `${formatNumber(steps)} / ${formatNumber(stepGoal)} steps`;

            }

            if (stepsProgressBar) {

                stepsProgressBar.style.width = stepPercentage + "%";

            }


            /* SLEEP PROGRESS */

            const sleepGoal = 8;

            const sleepPercentage = Math.min(
                (sleep / sleepGoal) * 100,
                100
            );

            if (sleepProgressText) {

                sleepProgressText.textContent =
                    `${sleep.toFixed(1)} / ${sleepGoal} hours`;

            }

            if (sleepProgressBar) {

                sleepProgressBar.style.width = sleepPercentage + "%";

            }


            /* RECOVERY RECOMMENDATIONS */

            if (recoveryContent) {

                let recoveryMessage = "";

                if (sleep === 0 && minutes === 0) {

                    recoveryMessage =
                        "Start recording your sleep and daily activities to receive recovery insights.";

                } else if (sleep > 0 && sleep < 6) {

                    recoveryMessage =
                        "Your recorded sleep is below 6 hours. Consider prioritising rest and allowing your body more time to recover.";

                } else if (sleep >= 6 && sleep < 7) {

                    recoveryMessage =
                        "Your sleep is improving. Consider getting a little more rest tonight.";

                } else if (minutes >= 120 && sleep < 8) {

                    recoveryMessage =
                        "You recorded a high activity duration. Prioritise hydration and adequate sleep.";

                } else if (sleep >= 7 && minutes <= 60) {

                    recoveryMessage =
                        "Your recorded sleep is within a good range. Keep maintaining a balanced activity and rest routine.";

                } else {

                    recoveryMessage =
                        "Keep monitoring your activity and sleep. Consistent rest and balanced movement support recovery.";

                }

                recoveryContent.textContent = recoveryMessage;

            }


            /* PROGRESS MESSAGE */

            if (progressMessage) {

                if (steps >= stepGoal && sleep >= sleepGoal) {

                    progressMessage.textContent =
                        "Excellent! You have reached both of today's activity and sleep goals.";

                } else if (steps >= stepGoal) {

                    progressMessage.textContent =
                        "Great work! You have reached your daily step goal.";

                } else if (sleep >= sleepGoal) {

                    progressMessage.textContent =
                        "Well done! You have reached your sleep goal.";

                } else {

                    progressMessage.textContent =
                        "Keep going. Your daily progress will update as you record activities and sleep.";

                }

            }

        }


        /* =========================================
           ACTIVITY FORM
        ========================================= */

        if (activityForm) {

            activityForm.addEventListener("submit", function (event) {

                event.preventDefault();

                if (!stepsInput || !activityMinutes) return;

                const steps = Number(stepsInput.value);
                const minutes = Number(activityMinutes.value);

                if (
                    stepsInput.value.trim() === "" ||
                    activityMinutes.value.trim() === ""
                ) {

                    showMessage(
                        activityMessage,
                        "Please enter both your steps and activity duration.",
                        "error"
                    );

                    return;

                }

                if (
                    !Number.isFinite(steps) ||
                    !Number.isFinite(minutes) ||
                    !Number.isInteger(steps) ||
                    !Number.isInteger(minutes) ||
                    steps < 0 ||
                    steps > 100000 ||
                    minutes < 0 ||
                    minutes > 1440
                ) {

                    showMessage(
                        activityMessage,
                        "Please enter valid activity values.",
                        "error"
                    );

                    return;

                }

                const record = getTodayRecord();

                record.steps = steps;
                record.minutes = minutes;
                record.updatedAt = new Date().toISOString();

                if (!saveRecords()) {

                    showMessage(
                        activityMessage,
                        "Unable to save your activity. Check your browser storage.",
                        "error"
                    );

                    return;

                }

                updateDashboard();

                showMessage(
                    activityMessage,
                    "Your daily activity has been saved successfully!",
                    "success"
                );

                showDashboardMessage("Activity updated successfully!");

            });

        }


        /* =========================================
           SLEEP FORM
        ========================================= */

        if (sleepDate) {

            sleepDate.value = today;
            sleepDate.max = today;

        }

        if (sleepForm) {

            sleepForm.addEventListener("submit", function (event) {

                event.preventDefault();

                if (!sleepHours || !sleepDate) return;

                const hours = Number(sleepHours.value);
                const selectedDate = sleepDate.value;

                if (
                    sleepHours.value.trim() === "" ||
                    !selectedDate
                ) {

                    showMessage(
                        sleepMessage,
                        "Please enter your sleep duration and date.",
                        "error"
                    );

                    return;

                }

                if (
                    !Number.isFinite(hours) ||
                    hours < 0 ||
                    hours > 24
                ) {

                    showMessage(
                        sleepMessage,
                        "Please enter a sleep duration between 0 and 24 hours.",
                        "error"
                    );

                    return;

                }

                if (selectedDate > today) {

                    showMessage(
                        sleepMessage,
                        "You cannot record sleep for a future date.",
                        "error"
                    );

                    return;

                }

                if (!records[selectedDate]) {

                    records[selectedDate] = {
                        steps: 0,
                        minutes: 0,
                        sleep: null,
                        updatedAt: null
                    };

                }

                records[selectedDate].sleep = hours;

                records[selectedDate].updatedAt =
                    new Date().toISOString();

                if (!saveRecords()) {

                    showMessage(
                        sleepMessage,
                        "Unable to save your sleep record.",
                        "error"
                    );

                    return;

                }

                if (selectedDate === today) {
                    updateDashboard();
                }

                showMessage(
                    sleepMessage,
                    "Your sleep record has been saved successfully!",
                    "success"
                );

                showDashboardMessage("Sleep record saved!");

            });

        }


        /* INITIALIZE */

        loadRecords();
        updateDashboard();

        console.log("FitGenius tracking initialized for user:", userId);

    }


    /* =========================================
       20. DASHBOARD AUTHENTICATION PROTECTION
    ========================================= */

    const logoutButton = document.getElementById("logoutButton");

    const dashboardUserName = document.getElementById("dashboardUserName");
    const dashboardUserEmail = document.getElementById("dashboardUserEmail");

    const isDashboardPage =
        window.location.pathname.endsWith("/dashboard.html") ||
        window.location.pathname === "dashboard.html";

    if (isDashboardPage) {

        async function protectDashboard() {

            if (!supabaseClient) {
                window.location.replace("login.html");
                return;
            }

            try {

                const { data, error } = await supabaseClient.auth.getSession();

                if (error || !data.session) {
                    window.location.replace("login.html");
                    return;
                }

                const user = data.session.user;

                const firstName = user.user_metadata?.first_name || "";
                const lastName = user.user_metadata?.last_name || "";

                const fullName = `${firstName} ${lastName}`.trim();

                if (dashboardUserName) {
                    dashboardUserName.textContent =
                        fullName || "FitGenius Member";
                }

                if (dashboardUserEmail) {
                    dashboardUserEmail.textContent = user.email || "";
                }

                /* START TRACKING AFTER AUTHENTICATION */

                initializeFitnessTracking(user.id);

            } catch (error) {

                console.error("Dashboard authentication error:", error);

                window.location.replace("login.html");

            }

        }

        protectDashboard();


        /* SIGN OUT */

        if (logoutButton) {

            logoutButton.addEventListener("click", async function () {

                logoutButton.disabled = true;

                logoutButton.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Signing out...';

                try {

                    const { error } = await supabaseClient.auth.signOut();

                    if (error) throw error;

                    window.location.replace("login.html");

                } catch (error) {

                    console.error("Sign out error:", error);

                    showDashboardMessage(
                        "Unable to sign out. Please try again."
                    );

                    logoutButton.disabled = false;

                    logoutButton.innerHTML =
                        '<i class="fa-solid fa-right-from-bracket"></i> Sign Out';

                }

            });

        }

    }


    /* =========================================
       21. GENERAL INITIALIZATION
    ========================================= */

    console.log("FitGenius initialized successfully!");

});
