const API_URL = "http://localhost:3250/event";
const container = document.getElementById("detail-container");

async function loadDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        container.innerHTML = "<p>Event not found.</p>";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        console.log("Respuesta:", data);  // <-- agrega esto
        renderDetail(data);
    } catch (err) {
        console.error("Error completo:", err);  // <-- y esto
        container.innerHTML = "<p>Error loading event.</p>";
    }
}

function renderDetail(event) {
    container.innerHTML = `
        <div class="detalle-card">
            <img 
                src="${event.image || ''}" 
                alt="${event.name}"
                onerror="this.src='https://via.placeholder.com/700x320?text=Sin+imagen'"
            />
            <div class="detalle-info">
                <div class="detalle-title">${event.name}</div>
                <div class="detalle-meta">
                    ${event.date    ? `<span class="badge">📅 ${new Date(event.date).toLocaleDateString('es-ES')}</span>` : ''}
                    ${event.category ? `<span class="badge">🏷️ ${event.category}</span>` : ''}
                    ${event.price   ? `<span class="badge price">💲${event.price}</span>` : ''}
                </div>
                <div class="detalle-desc">${event.description || 'Sin descripción.'}</div>
            </div>
        </div>
    `;
}

loadDetail();