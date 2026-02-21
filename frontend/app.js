const container = document.getElementById("events-container");

const API_URL = "http://localhost:3250/event";

async function loadEvents() {
    try {
        const res = await fetch(API_URL);
        const events = await res.json();

        renderEvents(events);

    } catch (err) {
        container.innerHTML = "<p>Error loading events</p>";
        console.error(err);
    }
}

function renderEvents(events) {
    container.innerHTML = "";

    events.forEach(event => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <img src="${event.image}" alt="event image"/>
          <div class="card-content">
            <div class="card-title">${event.name}</div>
            <div class="card-desc">${event.description || ""}</div>
          </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `detail.html?id=${event.id}`;
        });

        container.appendChild(card);
    });
}

loadEvents();