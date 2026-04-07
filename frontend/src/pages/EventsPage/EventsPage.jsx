import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEvents,
  getAllEvents,
  createEvent,
  getCategories,
  register,
  registerClick,
} from "../../services";
import {
  getEventTicketTypes,
  createEventTicketType,
} from "../../services/checkout.service";
import { getTicketTypes } from "../../services/ticketTypes.service";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal/Modal";
import EventForm from "../../components/EventForm/EventForm";
import Spinner from "../../components/Spinner/Spinner";
import styles from "./EventsPage.module.css";
import FormField from "../../components/FormField/FormField";

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [ticketModal, setTicketModal] = useState(false);
  const [ticketModalEvent, setTicketModalEvent] = useState(null);
  const [eventTicketTypes, setEventTicketTypes] = useState([]);
  const [allTicketTypes, setAllTicketTypes] = useState([]);
  const [loadingTT, setLoadingTT] = useState(false);
  const [savingTT, setSavingTT] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    ticketTypeId: "",
    price: "",
    totalQuantity: "",
    availableQuantity: "",
  });
  const { role } = useAuth();
  const ticketLoadId = useRef(0);

  const [form, setForm] = useState({
    name: "",
    date: "",
    description: "",
    image: "",
    category_id: "",
    price: "",
  });

  async function load(p = 1) {
    setLoading(true);
    try {
      const json =
        role === "Admin" ? await getAllEvents(p) : await getEvents(p);
      setEvents(json.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);

    const handleFocus = () => load(page);
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [page]);

  function openModal() {
    getCategories()
      .then(setCategories)
      .catch(() => {});
    setForm({
      name: "",
      date: "",
      description: "",
      image: "",
      category_id: "",
      price: "",
    });
    setModalOpen(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim()) return alert("El nombre es obligatorio.");
    setSaving(true);
    try {
      await createEvent({
        name: form.name,
        date: form.date || null,
        description: form.description || null,
        image: form.image || null,
        category_id: form.category_id || null,
        price: form.price || null,
      });
      setModalOpen(false);
      load(1);
      setPage(1);
    } catch {
      alert("Error al crear el evento.");
    } finally {
      setSaving(false);
    }
  }

  async function openTicketModal(ev) {
    const loadId = ++ticketLoadId.current;

    setTicketModalEvent(ev);
    setEventTicketTypes([]);
    setAllTicketTypes([]);
    setTicketForm({
      ticketTypeId: "",
      price: "",
      totalQuantity: "",
      availableQuantity: "",
    });
    setLoadingTT(true);
    setTicketModal(true);

    try {
      const [ett, all] = await Promise.all([
        getEventTicketTypes(ev.id).catch(() => []),
        getTicketTypes().catch(() => []),
      ]);

      if (loadId !== ticketLoadId.current) return;

      setEventTicketTypes(Array.isArray(ett) ? ett : []);
      setAllTicketTypes(Array.isArray(all) ? all : []);
    } finally {
      if (loadId === ticketLoadId.current) setLoadingTT(false);
    }
  }

  async function handleCreateTicketType(e) {
    e.preventDefault();
    if (!ticketForm.ticketTypeId) return alert("Selecciona un tipo de boleta.");
    setSavingTT(true);
    try {
      await createEventTicketType({
        eventId: ticketModalEvent.id,
        ticketTypeId: parseInt(ticketForm.ticketTypeId),
        price: parseFloat(ticketForm.price),
        totalQuantity: parseInt(ticketForm.totalQuantity),
        availableQuantity: parseInt(ticketForm.totalQuantity),
      });
      const updated = await getEventTicketTypes(ticketModalEvent.id);
      setEventTicketTypes(Array.isArray(updated) ? updated : []);
      setTicketForm({
        ticketTypeId: "",
        price: "",
        totalQuantity: "",
        availableQuantity: "",
      });
    } catch {
      alert("Error al asignar el tipo de boleta.");
    } finally {
      setSavingTT(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.heading}>
          {role === "Admin" ? "Todos los eventos" : "Eventos activos"}
        </h1>
        {role === "Admin" && (
          <button className={styles.btnAdd} onClick={openModal}>
            + Añadir evento
          </button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : events.length === 0 ? (
        <p className={styles.empty}>No hay eventos disponibles.</p>
      ) : (
        <div className={styles.grid}>
          {events.map((ev, i) => (
            <div
              key={ev.id}
              className={styles.card}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => {
                registerClick(ev.id);
                navigate(`/event/${ev.id}`);
              }}
            >
              <div className={styles.imgWrap}>
                <img
                  src={ev.image || ""}
                  alt={ev.name}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x220/e2e8f0/94a3b8?text=Sin+imagen";
                  }}
                />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardTitle}>{ev.name}</p>
                <p className={styles.cardDesc}>{ev.description || ""}</p>
                <div className={styles.cardMeta}>
                  {ev.date && (
                    <span className={styles.badge}>
                      📅 {new Date(ev.date).toLocaleDateString("es-ES")}
                    </span>
                  )}
                  {role === "Admin" && (
                    <span
                      className={
                        ev.status === "Active"
                          ? styles.badgeActive
                          : styles.badgeInactive
                      }
                    >
                      {ev.status === "Active" ? "Activo" : "Inactivo"}
                    </span>
                  )}
                </div>
                {role === "Admin" && (
                  <button
                    className={styles.btnTicket}
                    onClick={(e) => {
                      e.stopPropagation();
                      openTicketModal(ev);
                    }}
                  >
                    🎟 Gestionar boletas
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Anterior
          </button>
          <span className={styles.pageNum}>Página {page}</span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => p + 1)}
            disabled={events.length === 0}
          >
            Siguiente →
          </button>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo Evento"
      >
        <EventForm
          form={form}
          setForm={setForm}
          categories={categories}
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
          saving={saving}
          submitLabel="Crear"
        />
      </Modal>

      <Modal
        open={ticketModal}
        onClose={() => setTicketModal(false)}
        title={`Boletas — ${ticketModalEvent?.name}`}
      >
        {loadingTT ? (
          <Spinner />
        ) : (
          <>
            {eventTicketTypes.length > 0 && (
              <div className={styles.ettList}>
                {eventTicketTypes.map((ett) => (
                  <div key={ett.id} className={styles.ettItem}>
                    <div>
                      <span className={styles.ettName}>{ett.name}</span>
                      <span className={styles.ettSub}>
                        ${parseFloat(ett.price).toLocaleString("es-CO")}
                      </span>
                    </div>
                    <div className={styles.ettMeta}>
                      <span>
                        {ett.available_quantity} / {ett.total_quantity}{" "}
                        disponibles
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={handleCreateTicketType}
              style={{ marginTop: eventTicketTypes.length > 0 ? "1.25rem" : 0 }}
            >
              <p className={styles.ettFormTitle}>Asignar nuevo tipo</p>
              <FormField label="Tipo de boleta *">
                <select
                  className="field-input"
                  value={ticketForm.ticketTypeId}
                  onChange={(e) =>
                    setTicketForm((f) => ({
                      ...f,
                      ticketTypeId: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Seleccionar...</option>
                  {allTicketTypes.map((tt) => (
                    <option key={tt.id} value={tt.id}>
                      {tt.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Precio *">
                <input
                  className="field-input"
                  type="number"
                  min="0"
                  value={ticketForm.price}
                  onChange={(e) =>
                    setTicketForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="0"
                  required
                />
              </FormField>
              <FormField label="Aforo total *">
                <input
                  className="field-input"
                  type="number"
                  min="1"
                  value={ticketForm.totalQuantity}
                  onChange={(e) =>
                    setTicketForm((f) => ({
                      ...f,
                      totalQuantity: e.target.value,
                    }))
                  }
                  placeholder="100"
                  required
                />
              </FormField>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setTicketModal(false)}
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className={styles.btnSave}
                  disabled={savingTT}
                >
                  {savingTT ? "Guardando..." : "Asignar"}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
}
