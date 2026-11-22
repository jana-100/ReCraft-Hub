/* Phase 3: theme button, Back to Top button and footer clock */
(function () {

  /* Website themes: the button is only on the Home page,
     the other pages just apply the theme that was chosen */
  var themeButton = document.getElementById("theme-toggle");

  var moonIcon = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var sunIcon = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>';

  function setTheme(name) {
    if (name === "dark") {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
    if (themeButton) {
      /* moon in the light theme, sun in the dark theme */
      themeButton.innerHTML = name === "dark" ? sunIcon : moonIcon;
    }
    try {
      localStorage.setItem("recraft-theme", name);
    } catch (e) {
      /* storage may be blocked: the theme still works */
    }
  }

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      if (document.body.classList.contains("theme-dark")) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    });
  }

  /* remember the theme chosen last time */
  var saved = "light";
  try {
    saved = localStorage.getItem("recraft-theme") || "light";
  } catch (e) {
    /* ignore */
  }
  setTheme(saved === "dark" ? "dark" : "light");

  /* Back to Top button */
  var topButton = document.getElementById("back-to-top");

  if (topButton) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        topButton.classList.add("show");
      } else {
        topButton.classList.remove("show");
      }
    });

    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Real-time clock */
  var clock = document.getElementById("footer-clock");

  function updateClock() {
    var now = new Date();
    var date = now.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    var time = now.toLocaleTimeString("en-GB");
    clock.textContent = date + " | " + time;
  }

  if (clock) {
    updateClock();
    setInterval(updateClock, 1000);
  }

})();
