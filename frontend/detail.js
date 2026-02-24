const API_URL = "http://localhost:3250/event";
const container = document.getElementById("detail-container");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadDetail() {
    if (!id) {
        container.innerHTML = "<p>Event not found.</p>";
        return;
    }
    try {
        const res = await fetch(`http://localhost:3250/event/${id}`);
        const data = await res.json();
        renderDetail(data);
    } catch (err) {
        console.error("Error completo:", err);
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
                    ${event.date ? `<span class="badge">📅 ${new Date(event.date).toLocaleDateString('es-ES')}</span>` : ''}
                    ${event.category ? `<span class="badge">🏷️ ${event.category}</span>` : ''}
                    ${event.price ? `<span class="badge price">💲${event.price}</span>` : ''}
                </div>
                <div class="detalle-desc">${event.description || 'Sin descripción.'}</div>

                <div class="action-buttons">
                    <button class="btn-edit" onclick="openModal()">✏Editar</button>
                    <button class="btn-disable" onclick="disableEvent()">Deshabilitar</button>
                    <button class="btn-interest" onclick="clickInterest()">Me interesa</button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal-overlay" id="modal" onclick="closeModalOutside(event)">
            <div class="modal">
                <h2>Editar Evento</h2>
                <div class="form-group">
                    <label>Nombre</label>
                    <input id="f-name" type="text" value="${event.name || ''}"/>
                </div>
                <div class="form-group">
                    <label>Fecha</label>
                    <input id="f-date" type="datetime-local" value="${event.date ? event.date.slice(0, 16) : ''}"/>
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="f-description" rows="3">${event.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Imagen (URL)</label>
                    <input id="f-image" type="text" value="${event.image || ''}"/>
                </div>
                <div class="form-group">
                    <label>Categoría</label>
                    <input id="f-category" type="text" value="${event.category || ''}"/>
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input id="f-price" type="number" value="${event.price || ''}"/>
                </div>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
                    <button class="btn-save" onclick="saveEvent()">Guardar</button>
                </div>
            </div>
        </div>
    `;
}

function openModal() {
    document.getElementById("modal").classList.add("active");
}

function closeModal() {
    document.getElementById("modal").classList.remove("active");
}

function closeModalOutside(e) {
    if (e.target.id === "modal") closeModal();
}

async function saveEvent() {
    const body = {
        name: document.getElementById("f-name").value,
        date: document.getElementById("f-date").value || null,
        description: document.getElementById("f-description").value || null,
        image: document.getElementById("f-image").value || null,
        category_id: null,
        price: document.getElementById("f-price").value || null,
    };

    try {
        const res = await fetch(`http://localhost:3250/event/update/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        const updated = await res.json();
        closeModal();
        renderDetail(updated);
    } catch (err) {
        console.error("Error al guardar:", err);
        alert("Error al guardar los cambios.");
    }
}

async function disableEvent() {
    if (!confirm("¿Seguro que quieres deshabilitar este evento?")) return;

    try {
        await fetch(`http://localhost:3250/event/disable/${id}`, {method: "PATCH"});
        window.location.href = "index.html";
    } catch (err) {
        console.error("Error al deshabilitar:", err);
        alert("Error al deshabilitar el evento.");
    }
}

async function clickInterest() {
    try {
        await fetch(`http://localhost:3250/event/interested/${id}`, {method: "PATCH"});
        alert("¡Interés registrado!");
    } catch (err) {
        console.error("Error al registrar interés:", err);
        alert("Error al registrar el interés.");
    }
}

loadDetail();