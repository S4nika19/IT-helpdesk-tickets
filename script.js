// IT Helpdesk Tickets - simple ticket system in the browser.
// Tickets are saved in the browser (localStorage), so they stay after a page reload.

let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let currentFilter = "all";

const form = document.getElementById("ticket-form");
const list = document.getElementById("ticket-list");
const counter = document.getElementById("counter");

// Save all tickets in the browser
function saveTickets() {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

// Show the tickets on the page
function showTickets() {
  list.innerHTML = "";

  // Only show the tickets that match the filter
  const visible = tickets.filter(function (ticket) {
    if (currentFilter === "open") return !ticket.solved;
    if (currentFilter === "solved") return ticket.solved;
    return true;
  });

  visible.forEach(function (ticket) {
    const item = document.createElement("li");
    if (ticket.solved) item.classList.add("solved");

    const priorityClass = ticket.priority === "High" ? "high" : "";
    item.innerHTML =
      "<strong>#" + ticket.id + " " + ticket.category + "</strong> " +
      "<span class='" + priorityClass + "'>(" + ticket.priority + ")</span><br>" +
      escapeText(ticket.problem) + "<br>" +
      "<span class='small'>From " + escapeText(ticket.name) + " · " + ticket.date +
      " · " + (ticket.solved ? "Solved" : "Open") + "</span><br>";

    // Button to mark a ticket as solved (or open again)
    const button = document.createElement("button");
    button.textContent = ticket.solved ? "Reopen" : "Mark as solved";
    button.addEventListener("click", function () {
      ticket.solved = !ticket.solved;
      saveTickets();
      showTickets();
    });
    item.appendChild(button);

    list.appendChild(item);
  });

  const openCount = tickets.filter(function (t) { return !t.solved; }).length;
  counter.textContent = tickets.length + " tickets · " + openCount + " open";
}

// Stop HTML in user text from breaking the page
function escapeText(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Create a new ticket when the form is sent
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const ticket = {
    id: tickets.length + 1,
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    priority: document.getElementById("priority").value,
    problem: document.getElementById("problem").value,
    date: new Date().toLocaleDateString(),
    solved: false
  };

  tickets.push(ticket);
  saveTickets();
  showTickets();
  form.reset();
});

// Filter buttons: All / Open / Solved
document.querySelectorAll(".filters button").forEach(function (button) {
  button.addEventListener("click", function () {
    document.querySelectorAll(".filters button").forEach(function (b) {
      b.classList.remove("active");
    });
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    showTickets();
  });
});

showTickets();
