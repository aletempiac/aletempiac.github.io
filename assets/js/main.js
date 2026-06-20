(function () {
  "use strict";

  // ---- Theme toggle ----
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // ---- Email anti-spam (assemble mailto at runtime) ----
  Array.prototype.slice
    .call(document.querySelectorAll("a.js-email"))
    .forEach(function (el) {
      var user = el.getAttribute("data-user");
      var domain = el.getAttribute("data-domain");
      if (!user || !domain) return;
      var address = user + "@" + domain;
      el.setAttribute("href", "mailto:" + address);
      el.setAttribute("title", address);
      el.setAttribute("aria-label", "Email " + address);
    });

  // ---- Mobile nav ----
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // ---- Publication filter + search ----
  var pubList = document.getElementById("pub-list");
  if (pubList) {
    var chips = Array.prototype.slice.call(
      document.querySelectorAll(".filter-chip")
    );
    var searchInput = document.getElementById("pub-search");
    var items = Array.prototype.slice.call(
      pubList.querySelectorAll(".pub")
    );
    var groups = Array.prototype.slice.call(
      pubList.querySelectorAll(".year-group")
    );
    var emptyState = document.getElementById("pub-empty");
    var activeFilter = "all";

    function apply() {
      var query = (searchInput && searchInput.value || "")
        .trim()
        .toLowerCase();
      var anyVisible = false;

      items.forEach(function (item) {
        var type = item.getAttribute("data-type") || "";
        var blob = item.getAttribute("data-search") || "";
        var matchesFilter = activeFilter === "all" || type === activeFilter;
        var matchesQuery = !query || blob.indexOf(query) !== -1;
        var show = matchesFilter && matchesQuery;
        item.style.display = show ? "" : "none";
        if (show) anyVisible = true;
      });

      // Hide year-group headings that have no visible items
      groups.forEach(function (group) {
        var visible = group.querySelectorAll(
          '.pub:not([style*="display: none"])'
        ).length;
        group.style.display = visible > 0 ? "" : "none";
      });

      if (emptyState) {
        emptyState.style.display = anyVisible ? "none" : "block";
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("is-active");
        });
        chip.classList.add("is-active");
        activeFilter = chip.getAttribute("data-filter") || "all";
        apply();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", apply);
    }

    apply();
  }
})();
