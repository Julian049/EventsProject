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

function openAddModal() {
    document.getElementById("add-modal").classList.add("active");
}

function closeAddModal() {
    document.getElementById("add-modal").classList.remove("active");
}

function closeModalOutside(e) {
    if (e.target.id === "add-modal") closeAddModal();
}

async function handleCreateEvent() {
    const name = document.getElementById("a-name").value.trim();
    if (!name) {
        alert("El nombre es obligatorio.");
        return;
    }

    const body = {
        name,
        date:        document.getElementById("a-date").value || null,
        description: document.getElementById("a-description").value || null,
        image:       document.getElementById("a-image").value || null,
        category_id: null,
        price:       document.getElementById("a-price").value || null,
    };

    try {
        const res = await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const newEvent = await res.json();
        closeAddModal();
        loadEvents(); // recarga el listado
    } catch (err) {
        console.error("Error al crear:", err);
        alert("Error al crear el evento.");
    }
}