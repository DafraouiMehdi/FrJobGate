import React, { useState, useEffect, useRef } from "react";
import NavbarCandidat from "../CandidatNavbar/NavbarCandidat";
import { FaCamera, FaMicrophone, FaRegCircle,FaPlay, FaStop, FaCheckCircle } from "react-icons/fa";

// Couleurs de la charte JobGate
const COLORS = {
  blue: "#004085",
  blueLight: "#e9f2fb",
  blueMedium: "#007bff",
  orange: "#f5bb0c",
  orangeDark: "#f59e0b",
  grayBg: "#f6f8fa",
  grayLight: "#f8f9fa",
  grayBorder: "#e3e8ee",
  grayText: "#888",
  red: "#dc3545",
  white: "#fff",
};

const QUESTIONS = [
  "Pouvez-vous vous présenter en quelques mots et nous expliquer pourquoi vous êtes intéressé par ce poste ?",
  "Quelles sont vos principales compétences et comment les avez-vous acquises ?",
  "Pouvez-vous décrire une situation professionnelle difficile et comment vous l'avez résolue ?",
  "Quels sont vos objectifs de carrière à moyen et long terme ?",
  "Pourquoi pensez-vous être le meilleur candidat pour ce poste ?",
];

const PREP_TIME = 30; 
const RECORD_TIME = 60;

export default function Interview() {
  const [step, setStep] = useState(0); // 0 à 4
  const [phase, setPhase] = useState("prep"); // prep | record | wait | review
  const [prepTime, setPrepTime] = useState(PREP_TIME);
  const [recordTime, setRecordTime] = useState(RECORD_TIME);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [videos, setVideos] = useState([]); // URLs des vidéos pour chaque question
  const [error, setError] = useState("");
  const [reviewIndex, setReviewIndex] = useState(0);

  const videoRef = useRef(null);
  const reviewVideoRef = useRef(null);

  // Initialisation caméra/micro
  useEffect(() => {
    if (phase === "record" && isCameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setMediaStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
          setError("");
        })
        .catch(() => {
          setError(
            "Impossible d'accéder à votre caméra et microphone. Veuillez vérifier les permissions."
          );
        });
    }
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line
  }, [phase, isCameraOn]);

  // Timer de préparation
  useEffect(() => {
    if (phase === "prep" && prepTime > 0) {
      const timer = setTimeout(() => setPrepTime((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (phase === "prep" && prepTime === 0) {
      setPhase("record");
      setRecordTime(RECORD_TIME);
    }
    // eslint-disable-next-line
  }, [phase, prepTime]);

  // Timer d'enregistrement
  useEffect(() => {
    if (phase === "record" && recordTime > 0) {
      const timer = setTimeout(() => setRecordTime((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (phase === "record" && recordTime === 0) {
      stopRecording();
    }
    // eslint-disable-next-line
  }, [phase, recordTime]);

  // Démarrage de l'enregistrement vidéo
  useEffect(() => {
    if (phase === "record" && mediaStream) {
      let recorder;
      setChunks([]);
      // Correction : vérifie le support du type MIME
      let options = {};
      if (window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported("video/webm")) {
        options.mimeType = "video/webm";
      }
      try {
        recorder = new window.MediaRecorder(mediaStream, options);
      } catch (e) {
        // fallback sans options si erreur
        recorder = new window.MediaRecorder(mediaStream);
      }
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setChunks((prev) => [...prev, e.data]);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideos((prev) => {
          const arr = [...prev];
          arr[step] = url;
          return arr;
        });
        setPhase("wait");
        setTimeout(() => {
          if (step < QUESTIONS.length - 1) {
            setStep((s) => s + 1);
            setPhase("prep");
            setPrepTime(PREP_TIME);
          } else {
            setPhase("review");
            setReviewIndex(0);
          }
        }, 3000);
      };
      setMediaRecorder(recorder);
      recorder.start();
      return () => {
        if (recorder && recorder.state !== "inactive") recorder.stop();
      };
    }
    // eslint-disable-next-line
  }, [phase, mediaStream]);

  // Arrêt manuel de l'enregistrement
  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  }

  // Toggle caméra/micro
  function toggleCamera() {
    setIsCameraOn((on) => !on);
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn));
    }
  }
  function toggleMic() {
    setIsMicOn((on) => !on);
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => (track.enabled = !isMicOn));
    }
  }

  // Pour la review
  function handleReviewChange(idx) {
    setReviewIndex(idx);
    if (reviewVideoRef.current) {
      reviewVideoRef.current.load();
    }
  }

  // Progression de la barre lineaire des qst
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  // UI
  return (
    <div style={{ background: COLORS.grayBg, minHeight: "100vh" }}>
      <NavbarCandidat />
      {/* Progression */}
      <div
        style={{
          width: "100%",
          background: COLORS.white,
          borderBottom: `2px solid ${COLORS.grayBorder}`,
          padding: "0 0 0 0",
          marginBottom: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 32px",
            height: 44,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 7,
                background: COLORS.grayLight,
                borderRadius: 6,
                overflow: "hidden",
                marginTop: 12,
                marginBottom: 2,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, #004085 60%, #007bff 100%)`,
                  borderRadius: 6,
                  transition: "width 0.4s",
                }}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: 15,
              color: COLORS.grayText,
              marginLeft: 18,
              fontWeight: 600,
              minWidth: 70,
            }}
          >
            {step + 1}/{QUESTIONS.length}
          </div>
                    <div
            style={{
              fontSize: 15,
              color: COLORS.grayText,
              marginLeft: 18,
              fontWeight: 600,
              minWidth: 70,
            }}
          >
            Progression de l'entretien
          </div>
        </div>
      </div>
      {/* Corps */}
      <div
        style={{
          display: "flex",
          maxWidth: "90%",
          margin: "0 auto",
          padding: "32px 0 0 0",
          gap: 32,
        }}
      >
        {/* Colonne question */}
        <div
          style={{
            width: 350,
            minWidth: 260,
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              border: `1px solid #1177e4ff`,
              boxShadow: "0 2px 8px #007bff11",
              padding: "24px 22px 10px 22px",
              marginBottom: 0,
              height: 250,
            }}
          >
            <div
              style={{
                color: COLORS.blue,
                fontWeight: 700,
                fontSize: "1.18rem",
                marginBottom: 6,
                display: "flex",
                paddingTop: "10px",
                alignItems: "center",
                gap: 8,
              }}
            ><br></br>
              <FaRegCircle style={{ color: COLORS.blueMedium, fontSize: 18, marginRight: 6 }} />
              Présentation personnelle
              <span
                style={{
                  marginLeft: "auto",
                  color: COLORS.blueMedium,
                  fontWeight: 600,
                  fontSize: 13,
                  background: "#e1f0ff",
                  borderRadius: 8,
                  padding: "10px 10px",
                }}
              >
                Question {step + 1}/{QUESTIONS.length}
              </span>
            </div>
            <div
              style={{
                fontSize: "1.08rem",
                color: "#222",
                marginTop: 40,
                marginBottom: 50,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {QUESTIONS[step]}
            </div><hr></hr>
            <div
              style={{
                display: "flex",
                gap: 12,
                fontSize: 12,
                color: COLORS.grayText,
                marginBottom: 1,
                alignItems: "center",
              }}
            >
              <span
                style={{
                    color: COLORS.orangeDark,
                    fontWeight: 700,
                    paddingRight: 40,
                  }}
                >                
                <span>
                  30s
                </span>{" "}
                pour lire
              </span>

                <span
                style={{
                    color: COLORS.blueMedium,
                    fontWeight: 700,
                    paddingRight: 40,
                  }}
                >                
                <span>
                  60s
                </span>{" "}
                pour répondre
              </span>

              <span>
                <span style={{ color: COLORS.blue, fontWeight: 700 }}>
                  {step + 1}
                </span>{" "}
                sur {QUESTIONS.length}
              </span>
            </div>
          </div>
          {/* Timer lecture ou réponse */}
          <div
            style={{
              background: COLORS.grayLight,
              borderRadius: 12,
              border: `1px solid #1177e4ff`,
              boxShadow: "0 1px 4px #007bff11",
              padding: "22px 18px 18px 18px",
              marginTop: 50,
              height: 150,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: COLORS.blue,
                fontWeight: 700,
                fontSize: "1.08rem",
                marginTop: 20,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {phase === "prep" ? "Temps de lecture" : "Temps de réponse"}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: phase === "prep" ? COLORS.orangeDark : COLORS.blueMedium,
                marginBottom: 2,
                letterSpacing: 1,
              }}
            >
              {phase === "prep"
                ? `0:${prepTime.toString().padStart(2, "0")}`
                : `0:${recordTime.toString().padStart(2, "0")}`}
              <span
                style={{
                  fontSize: 15,
                  color: COLORS.grayText,
                  fontWeight: 500,
                  marginLeft: 8,
                }}
              >
                En cours
              </span>
            </div>
            <div
              style={{
                height: 7,
                background: "#e3e8ee",
                borderRadius: 6,
                margin: "8px 0 8px 0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: phase === "prep"
                    ? `${((PREP_TIME - prepTime) / PREP_TIME) * 100}%`
                    : `${((RECORD_TIME - recordTime) / RECORD_TIME) * 100}%`,
                  background:
                    phase === "prep"
                      ? `linear-gradient(90deg, #f5bb0c 60%, #f59e0b 100%)`
                      : `linear-gradient(90deg, #004085 60%, #007bff 100%)`,
                  borderRadius: 6,
                  transition: "width 1s linear",
                }}
              />
            </div>
            <div
              style={{
                color: COLORS.grayText,
                fontSize: 14,
                marginTop: 25,
                marginBottom: 27,
              }}
            >
              {phase === "prep"
                ? "Lisez attentivement la question"
                : "Enregistrez votre réponse"}
            </div>
          </div>
        </div>

        {/* Colonne vidéo */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingRight: 0,
            paddingLeft: 0,
          }}
        >
          {/* PHASE ENREGISTREMENT */}
          {phase !== "review" && (
            <div
              style={{
                width: 700,
                height: 500,
                background: COLORS.white,
                borderRadius: 14,
                boxShadow: "0 2px 12px #007bff11",
                padding: "32px 32px 28px 32px",
                marginBottom: 20,
                marginTop: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Header REC */}
              {phase === "record" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      background: COLORS.red,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 15,
                      borderRadius: 8,
                      padding: "3px 14px",
                      marginRight: 8,
                      letterSpacing: 1,
                    }}
                  >
                    ◉ REC
                  </span>
                  <span style={{ color: COLORS.grayText, fontWeight: 600 }}>
                    Enregistrement en cours...
                  </span>
                </div>
              )}
              {/* Zone vidéo */}
              <div
                style={{
                  width: "100%",
                  minHeight: 260,
                  height: 500,
                  background: COLORS.grayLight,
                  border: `2px solid ${COLORS.grayBorder}`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  marginBottom: 18,
                  position: "relative",
                }}
              >
                {phase === "record" ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 10,
                      background: "#e9e9e9",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      color: COLORS.grayText,
                    }}
                  >
                    <FaRegCircle
                      style={{
                        fontSize: 54,
                        color: COLORS.grayBorder,
                        marginBottom: 12,
                      }}
                    />
                    <div style={{ fontWeight: 600, fontSize: 18 }}>
                      Chargement de la caméra...
                    </div>
                  </div>
                )}

                {/* Erreur caméra/micro */}
                {error && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 0,
                      right: 0,
                      color: COLORS.red,
                      background: "#fdecea",
                      borderRadius: 6,
                      padding: "8px 12px",
                      fontSize: 14,
                      textAlign: "center",
                      margin: "0 20px",
                    }}
                  >
                    {error}
                  </div>
                )}
              </div>
              {/* Icônes caméra/micro */}
              <div
                style={{
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <button
                  onClick={toggleCamera}
                  style={{
                    background: isCameraOn ? COLORS.blueMedium : COLORS.grayBorder,
                    color: isCameraOn ? "#fff" : COLORS.grayText,
                    border: "none",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: isCameraOn ? "0 2px 8px #007bff22" : "none",
                    transition: "background 0.2s",
                  }}
                  title={isCameraOn ? "Désactiver la caméra" : "Activer la caméra"}
                >
                  <FaCamera />
                </button>
                <button
                  onClick={toggleMic}
                  style={{
                    background: isMicOn ? COLORS.blueMedium : COLORS.grayBorder,
                    color: isMicOn ? "#fff" : COLORS.grayText,
                    border: "none",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: isMicOn ? "0 2px 8px #007bff22" : "none",
                    transition: "background 0.2s",
                  }}
                  title={isMicOn ? "Désactiver le micro" : "Activer le micro"}
                >
                  <FaMicrophone />
                </button>
              </div>
              {/* CTA */}
              {phase === "prep" && (
                <div style={{ marginTop: 18, color: COLORS.grayText, fontSize: 15, textAlign: "center"}}>
                  Prêt pour l'enregistrement
                  <br />
                  <button
                    onClick={() => {
                      setPhase("record");
                      setRecordTime(RECORD_TIME);
                    }}
                    style={{
                      marginTop: 16,
                      background: COLORS.orange,
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "12px 32px",
                      fontWeight: 700,
                      fontSize: "1.08rem",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px #f5bb0c22",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FaPlay style={{ fontSize: 18}} />
                    Commencer à répondre
                  </button>
                  <div style={{ marginTop: 8, color: COLORS.grayText, fontSize: 14,textAlign: "center" }}>
                    Cliquez pour commencer l'enregistrement de votre réponse
                  </div>
                </div>
              )}
              {phase === "record" && (
                <div style={{ marginTop: 18 }}>
                  <button
                    onClick={stopRecording}
                    style={{
                      background: COLORS.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "12px 32px",
                      fontWeight: 700,
                      fontSize: "1.08rem",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px #dc354522",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FaStop style={{ fontSize: 18, marginRight: 6 }} />
                    Arrêter l'enregistrement
                  </button>
                  <div style={{ marginTop: 8, color: COLORS.grayText, fontSize: 14, textAlign: "center" }}>
                    Votre réponse est en cours d'enregistrement...
                  </div>
                </div>
              )}
              {phase === "wait" && (
                <div style={{ marginTop: 20, color: COLORS.blue, fontWeight: 600 }}>
                  <FaCheckCircle style={{ color: COLORS.blueMedium, marginRight: 8, fontSize: 18 }} />
                  Passage à la question suivante...
                </div>
              )}
            </div>
          )}
          {/* PHASE REVIEW */}
          {phase === "review" && (
            <div
              style={{
                width: "100%",
                maxWidth: 700,
                background: COLORS.white,
                borderRadius: 14,
                boxShadow: "0 2px 12px #007bff11",
                padding: "32px 32px 28px 32px",
                marginBottom: 18,
                marginTop: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: COLORS.blue,
                  fontSize: "1.18rem",
                  marginBottom: 16,
                }}
              >
                Relecture de votre entretien
              </div>
              <div style={{ width: "100%", marginBottom: 18 }}>
                <video
                  ref={reviewVideoRef}
                  src={videos[reviewIndex]}
                  controls
                  style={{
                    width: "100%",
                    minHeight: 260,
                    height: 320,
                    background: "#e9e9e9",
                    borderRadius: 10,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 18,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleReviewChange(idx)}
                    style={{
                      background:
                        idx === reviewIndex ? COLORS.blueMedium : COLORS.grayLight,
                      color: idx === reviewIndex ? "#fff" : COLORS.blue,
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 18px",
                      fontWeight: 700,
                      fontSize: "1.01rem",
                      cursor: "pointer",
                      boxShadow:
                        idx === reviewIndex ? "0 2px 8px #007bff22" : "none",
                      transition: "background 0.2s",
                    }}
                  >
                    Question {idx + 1}
                  </button>
                ))}
              </div>
              <button
                style={{
                  background: COLORS.blue,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 38px",
                  fontWeight: 700,
                  fontSize: "1.13rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #007bff22",
                  marginTop: 10,
                  transition: "background 0.2s",
                }}
                onClick={() => alert("Entretien envoyé au recruteur !")}
              >
                Envoyer l'entretien
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}