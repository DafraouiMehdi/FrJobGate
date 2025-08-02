import React, { useState } from "react";
import NavbarCandidat from "../CandidatNavbar/NavbarCandidat";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";


const mockInvitations = [
  {
    id: 1,
    nomEntreprise: "TechCorp Solutions",
    objet: "Invitation à entretien vidéo différé",
    dateReception: new Date("2025-07-30"),
    lu: false,
    dateDebutDisponibilite: new Date("2025-08-01"),
    dateFinDisponibilite: new Date("2025-08-07"),
    expiré: false,
    poste: "Développeur Frontend React",
  },
  {
    id: 2,
    nomEntreprise: "InnovateLab",
    objet: "Invitation à entretien vidéo différé",
    dateReception: new Date("2025-07-29"),
    lu: false,
    dateDebutDisponibilite: new Date("2025-08-02"),
    dateFinDisponibilite: new Date("2025-08-05"),
    expiré: false,
    poste: "Ingénieur Full Stack",
  },
  {
    id: 3,
    nomEntreprise: "Digital Dynamics",
    objet: "Invitation à entretien vidéo différé",
    dateReception: new Date("2024-07-28"),
    lu: true,
    dateDebutDisponibilite: new Date("2024-07-25"),
    dateFinDisponibilite: new Date("2024-08-03"),
    expiré: true,
    poste: "Lead Developer",
  },
  {
    id: 4,
    nomEntreprise: "StartupVision",
    objet: "Invitation à entretien vidéo différé",
    dateReception: new Date("2024-07-27"),
    lu: true,
    dateDebutDisponibilite: new Date("2024-07-28"),
    dateFinDisponibilite: new Date("2024-08-02"),
    expiré: true,
    poste: "CTO",
  },
  {
    id: 5,
    nomEntreprise: "CloudTech Systems",
    objet: "Invitation à entretien vidéo différé",
    dateReception: new Date("2025-07-26"),
    lu: false,
    dateDebutDisponibilite: new Date("2025-07-29"),
    dateFinDisponibilite: new Date("2025-08-03"),
    expiré: false,
    poste: "Architecte Cloud",
  },
];

function formatDate(date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Messagerie() {
  const [invitations, setInvitations] = useState(mockInvitations);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("tous");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const filteredInvitations = invitations.filter((inv) => {
    if (filter === "nonlus" && inv.lu) return false;
    if (filter === "actifs" && inv.expiré) return false;
    if (filter === "expires" && !inv.expiré) return false;
    if (
      searchText &&
      !inv.nomEntreprise.toLowerCase().includes(searchText.toLowerCase())
    )
      return false;
    return true;
  });

  function selectInvitation(id) {
    setSelectedId(id);
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === id && !inv.lu ? { ...inv, lu: true } : inv
      )
    );
  }

  function markAllRead() {
    setInvitations((prev) => prev.map((inv) => ({ ...inv, lu: true })));
  }

  const selectedInvitation = invitations.find((inv) => inv.id === selectedId);

  const countNonLus = invitations.filter((inv) => !inv.lu).length;
  const countActifs = invitations.filter((inv) => !inv.expiré).length;
  const countExpires = invitations.filter((inv) => inv.expiré).length;

  // Couleurs
  const blue = "#004085";
  const blueLight = "#e9f2fb";
  const blueHover = "#ffc107";
  const yellow = "#f5bb0cff";
  const red = "#dc3545";
  const gray = "#f6f8fa";
  const border = "#e3e8ee";

  // Filtres pour la sidebar
  const filterTabs = [
    { key: "tous", label: `Tous (${invitations.length})` },
    { key: "nonlus", label: `Non lus (${countNonLus})` },
    { key: "actifs", label: `Actifs (${countActifs})` },
    { key: "expires", label: `Expirés (${countExpires})` },
  ];

  return (
    <>
      <NavbarCandidat />
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 80px)",
          background: gray,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#222",
        }}
      >
        {/* Sidebar gauche */}
        <aside
          style={{
            width: 370,
            minWidth: 260,
            maxWidth: 420,
            borderRight: `1.5px solid ${border}`,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: 0,
            height: "100%",
          }}
        >
          {/* Recherche + actions */}
          <div
            style={{
              padding: "18px 20px 10px 20px",
              borderBottom: `1.5px solid ${border}`,
              background: gray,
            }}
          >
            <input
              type="text"
              placeholder="🔍 Rechercher une entreprise..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: "90%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: `1.5px solid #cfd8dc`,
                fontSize: "15px",
                marginBottom: "12px",
                background: "#fff",
                outline: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  color: "#888",
                  fontSize: 14,
                  flex: 1,
                }}
              >
                {invitations.length} messages
              </span>
              <button
                title="Tout marquer comme lu"
                onClick={markAllRead}
                style={{
                  padding: "7px 14px",
                  backgroundColor: "#007bff",
                  border: "none",
                  borderRadius: "7px",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background 0.2s",
                }}
              >
                Tout marquer comme lu
              </button>
            </div>
          </div>
          {/* Filtres */}
          <nav
            style={{
              display: "flex",
              gap: "8px",
              padding: "12px 20px 8px 20px",
              borderBottom: `1.5px solid ${border}`,
              background: gray,
            }}
          >
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  backgroundColor: filter === tab.key ? blue : "transparent",
                  color: filter === tab.key ? "#fff" : blue,
                  padding: "5px 18px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 150,
                  fontSize: "10px",
                  transition: "background 0.2s, color 0.2s",
                  outline: "none",
                  ...(filter !== tab.key
                    ? {
                        ":hover": {
                          backgroundColor: blueHover,
                          color: blue,
                        },
                      }
                    : {}),
                }}
                onMouseOver={(e) => {
                  if (filter !== tab.key)
                    e.currentTarget.style.backgroundColor = blueHover;
                }}
                onMouseOut={(e) => {
                  if (filter !== tab.key)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          {/* Liste des invitations */}
          <div
            style={{
              overflowY: "auto",
              flex: 1,
              padding: 0,
              background: "#fff",
            }}
          >
            <div style={{ padding: "10px 0 0 0" }}>
              <div
                style={{
                  fontWeight: 700,
                  color: blue,
                  fontSize: "1.08rem",
                  padding: "0 20px 8px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                Invitations d'entretien
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: "13px",
                    color: blue,
                    backgroundColor: "#e1f0ff",
                    padding: "2px 10px",
                    borderRadius: "12px",
                  }}
                >
                  {countNonLus} non lus
                </span>
              </div>
              {filteredInvitations.length === 0 && (
                <p
                  style={{
                    color: "#888",
                    fontStyle: "italic",
                    padding: "24px 20px",
                  }}
                >
                  Aucune invitation trouvée.
                </p>
              )}
              {filteredInvitations.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => selectInvitation(inv.id)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    border:
                      selectedId === inv.id
                        ? `2px solid #007bff`
                        : "1.5px solid #e3e8ee",
                    background:
                      selectedId === inv.id
                        ? blueLight
                        : inv.lu
                        ? "#fff"
                        : "#f1f7ff",
                    margin: "0 14px 12px 14px",
                    padding: "16px 18px",
                    boxShadow:
                      selectedId === inv.id ? "0 2px 8px #007bff22" : "none",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    position: "relative",
                    transition: "background 0.2s, border 0.2s",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "#cce5ff",
                      color: blue,
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(inv.nomEntreprise)}
                  </div>
                  {/* Infos */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: blue,
                          fontSize: "1.07rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 160,
                          display: "inline-block",
                        }}
                      >
                        {inv.nomEntreprise}
                      </span>
                      {!inv.lu && (
                        <span
                          style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            backgroundColor: yellow,
                            borderRadius: "50%",
                            marginLeft: "2px",
                          }}
                          title="Non lu"
                        ></span>
                      )}
                      {inv.expiré && (
                        <span
                          style={{
                            background: red,
                            color: "#fff",
                            fontSize: "11px",
                            borderRadius: "10px",
                            padding: "2px 8px",
                            fontWeight: 600,
                            marginLeft: 6,
                          }}
                        >
                          Expiré
                        </span>
                      )}
                      {!inv.lu && !inv.expiré && (
                        <span
                          style={{
                            background: yellow,
                            color: "#222",
                            fontSize: "11px",
                            borderRadius: "10px",
                            padding: "2px 8px",
                            fontWeight: 600,
                            marginLeft: 6,
                          }}
                        >
                          Nouveau
                        </span>
                      )}
                      <span
                        style={{
                          marginLeft: "auto",
                          color: "#888",
                          fontSize: "13px",
                        }}
                      >
                        {formatDate(inv.dateReception)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: blue,
                        fontSize: "1.01rem",
                        margin: "2px 0 2px 0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 200,
                      }}
                    >
                      {inv.objet}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        fontWeight: 500,
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 200,
                      }}
                    >
                      {inv.poste}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FaCalendarAlt style={{ fontSize: 13, marginRight: 2 }} />
                      Jusqu'au {formatDate(inv.dateFinDisponibilite)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        {/* Partie droite */}
        <section
          style={{
            flex: 1,
            minWidth: 0,
            background: gray,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: 0,
          }}
        >
          {!selectedInvitation ? (
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                color: blue,
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                Messagerie des invitations
              </div>
              <div style={{ color: "#888", fontSize: "1.1rem" }}>
                Sélectionnez une invitation pour afficher les détails.
              </div>
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "32px 40px 24px 40px",
                background: gray,
                minWidth: 0,
                height: "100%", //hnaaa
                boxSizing: "border-box",
                maxWidth: 950,
                margin: "0 auto",
                overflowY: "scroll",
            }}
            >

              {/* Header entreprise */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#fff",
                  borderRadius: "5px",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  padding: "22px 28px 18px 28px",
                  marginBottom: "22px",
                  gap: 18,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: "#cce5ff",
                    color: blue,
                    fontWeight: 700,
                    fontSize: "1.35rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 18,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(selectedInvitation.nomEntreprise)}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: blue,
                      fontSize: "1.18rem",
                    }}
                  >
                    {selectedInvitation.nomEntreprise}
                  </div>
                  <div
                    style={{
                      color: "#222",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                      marginTop: 2,
                    }}
                  >
                    {selectedInvitation.objet}
                  </div>
                  <div
                    style={{
                      color: "#888",
                      fontSize: "0.98rem",
                      marginTop: 2,
                    }}
                  >
                    {selectedInvitation.poste}
                  </div>
                  <div
                    style={{
                      color: "#888",
                      fontSize: "0.98rem",
                      marginTop: 2,
                    }}
                  >
                    Reçu le {formatDate(selectedInvitation.dateReception)}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 6,
                  }}
                >
                  {!selectedInvitation.lu && !selectedInvitation.expiré && (
                    <span
                      style={{
                        background: yellow,
                        color: "#222",
                        fontSize: "12px",
                        borderRadius: "10px",
                        padding: "3px 12px",
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      Nouveau
                    </span>
                  )}
                  {selectedInvitation.expiré && (
                    <span
                      style={{
                        background: red,
                        color: "#fff",
                        fontSize: "12px",
                        borderRadius: "10px",
                        padding: "3px 12px",
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      Expiré
                    </span>
                  )}
                </div>
              </div>
              {/* Message entreprise */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "5px",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  padding: "28px 28px 18px 28px",
                  marginBottom: "22px",
                  fontSize: "1.08rem",
                  color: "#222",
                  lineHeight: 1.7,
                  width: "93%",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: blue,
                    fontSize: "1.13rem",
                    marginBottom: 10,
                  }}
                >
                  Message de l'entreprise
                </div>
                <div
                  style={{
                    background: "#f6f8fa",
                    borderRadius: "8px",
                    padding: "18px 18px 14px 18px",
                    marginBottom: "18px",
                    color: "#222",
                    fontSize: "1.05rem",
                    borderLeft: `4px solid ${blue}`,
                  }}
                >
                  Bonjour{" "}
                  <span style={{ fontWeight: 700 }}>Jean Dupont</span>,<br />
                  <br />
                  Votre candidature a retenu notre attention. Nous vous invitons à
                  réaliser un entretien vidéo différé pour le poste de{" "}
                  <b>{selectedInvitation.poste}</b>.<br />
                  <br />
                  Nous vous remercions de l'intérêt que vous portez à notre
                  entreprise et espérons avoir l'opportunité d'échanger avec
                  vous.<br />
                  <br />
                  Cordialement,<br />
                  L'équipe RH de <b>{selectedInvitation.nomEntreprise}</b>
                </div>
                {/* Détails entretien */}
                <div
                  style={{
                    fontWeight: 700,
                    color: "#222",
                    fontSize: "1.09rem",
                    margin: "18px 0 10px 0",
                  }}
                >
                  Détails de l'entretien vidéo différé
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "22px",
                    marginBottom: "18px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "10px",
                      padding: "18px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      minWidth: 220,
                      flex: 1,
                      border: `1.5px solid #e3e8ee`,
                    }}
                  >
                    <FaCalendarAlt style={{ color: blue, fontSize: 22 }} />
                    <div>
                      <div style={{ color: "#888", fontSize: "0.98rem" }}>
                        Disponible du
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#222",
                          fontSize: "1.05rem",
                        }}
                      >
                        {formatDate(selectedInvitation.dateDebutDisponibilite)}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "10px",
                      padding: "18px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      minWidth: 220,
                      flex: 1,
                      border: `1.5px solid #e3e8ee`,
                    }}
                  >
                    <FaClock style={{ color: blue, fontSize: 22 }} />
                    <div>
                      <div style={{ color: "#888", fontSize: "0.98rem" }}>
                        Jusqu'au
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#222",
                          fontSize: "1.05rem",
                        }}
                      >
                        {formatDate(selectedInvitation.dateFinDisponibilite)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Instructions */}
                <div
                  style={{
                    fontWeight: 700,
                    color: "#222",
                    fontSize: "1.09rem",
                    margin: "18px 0 10px 0",
                  }}
                >
                  Instructions
                </div>
                <ol
                  style={{
                    paddingLeft: 24,
                    color: "#222",
                    fontSize: "1.03rem",
                    marginBottom: "18px",
                  }}
                >
                  <li style={{ marginBottom: 7 }}>
                    Assurez-vous d'être dans un environnement calme avec une bonne
                    connexion internet
                  </li>
                  <li style={{ marginBottom: 7 }}>
                    Vérifiez que votre caméra et microphone fonctionnent correctement
                  </li>
                  <li style={{ marginBottom: 7 }}>
                    Préparez-vous à répondre à plusieurs questions sur votre
                    expérience et motivation
                  </li>
                  <li style={{ marginBottom: 7 }}>
                    L'entretien dure environ 15-20 minutes et peut être réalisé en
                    une seule fois
                  </li>
                </ol>
                {/* CTA */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: 18,
                  }}
                >
                  <button
                    onClick={() =>
                      !selectedInvitation.expiré &&
                      navigate("/candidat/dashboard/messagerie/instructions")
                    }
                    disabled={selectedInvitation.expiré}
                    style={{
                      backgroundColor: selectedInvitation.expiré
                        ? "#bfc9d1"
                        : blue,
                      color: "#fff",
                      border: "none",
                      padding: "13px 38px",
                      borderRadius: "30px",
                      marginTop: 50,
                      fontWeight: 600,
                      fontSize: "1.13rem",
                      cursor: selectedInvitation.expiré
                        ? "not-allowed"
                        : "pointer",
                      marginBottom: 10,
                      boxShadow: selectedInvitation.expiré
                        ? "none"
                        : "0 2px 8px #007bff22",
                      transition: "background 0.2s",
                    }}
                  >
                    {selectedInvitation.expiré ? (
                      <>
                        <FaClock
                          style={{
                            marginRight: 8,
                            fontSize: 18,
                            verticalAlign: "middle",
                          }}
                        />
                        Entretien expiré
                      </>
                    ) : (
                      "Lancer l'entretien"
                    )}
                  </button>
                  {selectedInvitation.expiré && (
                    <div
                      style={{
                        color: "#888",
                        fontSize: "1.01rem",
                        marginTop: 2,
                      }}
                    >
                      Cette invitation a expiré le{" "}
                      {formatDate(selectedInvitation.dateFinDisponibilite)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

