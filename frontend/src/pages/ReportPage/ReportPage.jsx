import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllInterested,
  getFavoritesReport,
  getUsers,
  getDashboardMetrics,
  getSalesByEvent,
} from "../../services";
import Spinner from "../../components/Spinner/Spinner";
import styles from "./ReportPage.module.css";

const TOP = 10;
const TABS = [
  { key: "dashboard", label: "📊 Dashboard" },
  { key: "sales", label: "💸 Ventas" },
  { key: "clicks", label: "🖱 Clicks" },
  { key: "favorites", label: "⭐ Favoritos" },
  { key: "users", label: "👥 Usuarios" },
];

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [clickRows, setClickRows] = useState([]);
  const [favoriteRows, setFavoriteRows] = useState([]);
  const [userRows, setUserRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllClicks, setShowAllClicks] = useState(false);
  const [showAllFavs, setShowAllFavs] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [salesRows, setSalesRows] = useState([]);
  const [salesFilter, setSalesFilter] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [interests, favorites, users, metricsData, sales] =
          await Promise.all([
            getAllInterested(),
            getFavoritesReport(),
            getUsers(),
            getDashboardMetrics(),
            getSalesByEvent(),
          ]);

        setMetrics(metricsData);
        setSalesRows(Array.isArray(sales) ? sales : []);

        // Clicks
        const countMap = {};
        interests.forEach((i) => {
          if (i.type === "click") {
            countMap[i.event_id] = (countMap[i.event_id] || 0) + 1;
          }
        });
        setClickRows(
          favorites
            .map((ev) => ({ ...ev, count: countMap[ev.id] || 0 }))
            .sort((a, b) => b.count - a.count),
        );

        // Favoritos
        setFavoriteRows(
          favorites.map((ev) => ({ ...ev, count: Number(ev.total_favorites) })),
        );

        // Usuarios
        setUserRows(users);
      } catch {
        setClickRows([]);
        setFavoriteRows([]);
        setUserRows([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const maxClicks =
    clickRows.length > 0 ? Math.max(...clickRows.map((r) => r.count), 1) : 1;
  const maxFavorites =
    favoriteRows.length > 0
      ? Math.max(...favoriteRows.map((r) => r.count), 1)
      : 1;

  const RankingTable = ({ rows, maxCount, showAll, onToggle }) => {
    const visible = showAll ? rows : rows.slice(0, TOP);
    return (
      <>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Evento</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr
                  key={row.id}
                  className={styles.row}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <td className={styles.rank}>#{i + 1}</td>
                  <td className={styles.name}>
                    <Link to={`/event/${row.id}`}>{row.name}</Link>
                  </td>
                  <td className={styles.barCell}>
                    <div className={styles.barWrap}>
                      <div
                        className={styles.bar}
                        style={{
                          width: `${Math.max((row.count / maxCount) * 100, row.count > 0 ? 4 : 0)}%`,
                        }}
                      />
                      <span className={styles.count}>{row.count}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > TOP && (
          <button className={styles.btnToggle} onClick={onToggle}>
            {showAll
              ? `▲ Mostrar solo Top ${TOP}`
              : `▼ Ver todos (${rows.length})`}
          </button>
        )}
      </>
    );
  };

  const UsersTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {userRows.map((user, i) => (
            <tr
              key={user.id}
              className={styles.row}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <td className={styles.rank}>#{user.id}</td>
              <td className={styles.name}>{user.name}</td>
              <td className={styles.name}>{user.email}</td>
              <td>
                <span
                  className={
                    user.role === "Admin"
                      ? styles.badgeAdmin
                      : styles.badgeMember
                  }
                >
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.page}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {activeTab === "dashboard" && metrics && (
            <>
              <h1 className={styles.heading}>Dashboard</h1>
              <p className={styles.sub}>Resumen general de la plataforma</p>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricIcon}>👥</span>
                  <span className={styles.metricValue}>
                    {Number(metrics.totalUsers).toLocaleString("es-CO")}
                  </span>
                  <span className={styles.metricLabel}>
                    Usuarios registrados
                  </span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricIcon}>📅</span>
                  <span className={styles.metricValue}>
                    {Number(metrics.totalEvents).toLocaleString("es-CO")}
                  </span>
                  <span className={styles.metricLabel}>
                    Eventos en plataforma
                  </span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricIcon}>🎟</span>
                  <span className={styles.metricValue}>
                    {Number(metrics.totalTickets).toLocaleString("es-CO")}
                  </span>
                  <span className={styles.metricLabel}>Boletas emitidas</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricIcon}>🛒</span>
                  <span className={styles.metricValue}>
                    {Number(metrics.totalPurchases).toLocaleString("es-CO")}
                  </span>
                  <span className={styles.metricLabel}>Compras realizadas</span>
                </div>
                <div
                  className={`${styles.metricCard} ${styles.metricCardAccent}`}
                >
                  <span className={styles.metricIcon}>💰</span>
                  <span className={styles.metricValue}>
                    $
                    {Number(metrics.totalRevenue).toLocaleString("es-CO", {
                      minimumFractionDigits: 0,
                    })}
                  </span>
                  <span className={styles.metricLabel}>Ingresos totales</span>
                </div>
              </div>

              <div className={styles.barSection}>
                <h2 className={styles.barSectionTitle}>
                  Proporción de actividad
                </h2>
                <div className={styles.barChart}>
                  {[
                    {
                      label: "Usuarios",
                      value: Number(metrics.totalUsers),
                      color: "#6366f1",
                    },
                    {
                      label: "Compras",
                      value: Number(metrics.totalPurchases),
                      color: "#f97316",
                    },
                    {
                      label: "Boletas",
                      value: Number(metrics.totalTickets),
                      color: "#22c55e",
                    },
                  ].map((item) => {
                    const max = Math.max(
                      Number(metrics.totalUsers),
                      Number(metrics.totalPurchases),
                      Number(metrics.totalTickets),
                      1,
                    );
                    return (
                      <div key={item.label} className={styles.barChartRow}>
                        <span className={styles.barChartLabel}>
                          {item.label}
                        </span>
                        <div className={styles.barChartTrack}>
                          <div
                            className={styles.barChartFill}
                            style={{
                              width: `${(item.value / max) * 100}%`,
                              background: item.color,
                            }}
                          />
                        </div>
                        <span className={styles.barChartValue}>
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {activeTab === "sales" && (
            <>
              <h1 className={styles.heading}>Ventas por evento</h1>
              <p className={styles.sub}>
                Desglose de boletas vendidas e ingresos por tipo de boleta
              </p>

              <div className={styles.filterRow}>
                <input
                  className={styles.filterInput}
                  type="text"
                  placeholder="Filtrar por nombre de evento..."
                  value={salesFilter}
                  onChange={(e) => setSalesFilter(e.target.value)}
                />
                {salesFilter && (
                  <button
                    className={styles.filterClear}
                    onClick={() => setSalesFilter("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              {(() => {
                const filtered = salesRows.filter((r) =>
                  r.eventName.toLowerCase().includes(salesFilter.toLowerCase()),
                );

                if (filtered.length === 0)
                  return <p className={styles.empty}>No hay resultados.</p>;

                // Agrupar por evento
                const grouped = filtered.reduce((acc, row) => {
                  if (!acc[row.eventId])
                    acc[row.eventId] = {
                      name: row.eventName,
                      date: row.eventDate,
                      rows: [],
                    };
                  acc[row.eventId].rows.push(row);
                  return acc;
                }, {});

                return Object.values(grouped).map((group) => {
                  const groupTotal = group.rows.reduce(
                    (sum, r) => sum + Number(r.totalRevenue),
                    0,
                  );
                  const groupTickets = group.rows.reduce(
                    (sum, r) => sum + Number(r.ticketsSold),
                    0,
                  );
                  return (
                    <div key={group.name} className={styles.salesGroup}>
                      <div className={styles.salesGroupHeader}>
                        <div>
                          <span className={styles.salesEventName}>
                            {group.name}
                          </span>
                          <span className={styles.salesEventDate}>
                            📅{" "}
                            {new Date(group.date).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                        <div className={styles.salesGroupSummary}>
                          <span>{groupTickets} boletas</span>
                          <span className={styles.salesGroupRevenue}>
                            $
                            {groupTotal.toLocaleString("es-CO", {
                              minimumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                      </div>
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>Tipo de boleta</th>
                              <th>Boletas vendidas</th>
                              <th>Ingresos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.rows.map((row, i) => (
                              <tr key={i} className={styles.row}>
                                <td className={styles.name}>
                                  {row.ticketType}
                                </td>
                                <td className={styles.rank}>
                                  {row.ticketsSold}
                                </td>
                                <td className={styles.count}>
                                  $
                                  {Number(row.totalRevenue).toLocaleString(
                                    "es-CO",
                                    { minimumFractionDigits: 0 },
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                });
              })()}
            </>
          )}
          {activeTab === "clicks" && (
            <>
              <h1 className={styles.heading}>Reporte de Clicks</h1>
              <p className={styles.sub}>
                Eventos ordenados por cantidad de clicks recibidos
              </p>
              {clickRows.length === 0 ? (
                <p className={styles.empty}>No hay datos para mostrar.</p>
              ) : (
                <RankingTable
                  rows={clickRows}
                  maxCount={maxClicks}
                  showAll={showAllClicks}
                  onToggle={() => setShowAllClicks((v) => !v)}
                />
              )}
            </>
          )}

          {activeTab === "favorites" && (
            <>
              <h1 className={styles.heading}>Reporte de Favoritos</h1>
              <p className={styles.sub}>
                Eventos ordenados por cantidad de "Me interesa"
              </p>
              {favoriteRows.length === 0 ? (
                <p className={styles.empty}>No hay datos para mostrar.</p>
              ) : (
                <RankingTable
                  rows={favoriteRows}
                  maxCount={maxFavorites}
                  showAll={showAllFavs}
                  onToggle={() => setShowAllFavs((v) => !v)}
                />
              )}
            </>
          )}

          {activeTab === "users" && (
            <>
              <h1 className={styles.heading}>Reporte de Usuarios</h1>
              <p className={styles.sub}>
                {userRows.length} usuarios registrados en el sistema
              </p>
              {userRows.length === 0 ? (
                <p className={styles.empty}>No hay usuarios para mostrar.</p>
              ) : (
                <UsersTable />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
