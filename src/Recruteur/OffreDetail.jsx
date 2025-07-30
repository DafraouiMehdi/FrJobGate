import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEllipsisH, FaArrowRight, FaArrowLeft, FaTimes, FaVideo, FaPaperPlane } from 'react-icons/fa';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Container styles
const Container = styled.div`
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 30px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ColumnLeft = styled.div`
  flex: 1;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 24px;
    color: #2c3e50;
    margin-bottom: 15px;
    font-weight: 600;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
  }

  h2 {
    margin-top: 25px;
    color: #2c3e50;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 8px;
  }

  p {
    margin-bottom: 12px;
    color: #555;
    line-height: 1.5;
  }
`;

const ColumnRight = styled.div`
  flex: 2;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  button {
    position: relative;
    flex: 1;
    background-color: transparent;
    color: #7f8c8d;
    border: none;
    padding: 10px 15px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    white-space: nowrap;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 60%;
      width: 1px;
      background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%);
    }

    &:hover {
      background-color: rgba(52, 152, 219, 0.1);
      color: #3498db;
    }

    &.active {
      background-color: #3498db;
      color: white;
      animation: ${pulse} 1.5s infinite;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2);
    }
  }
`;

const SendInterviewButton = styled.button`
  background-color: #9b59b6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #8e44ad;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;

  thead tr {
    background-color: #f8f9fa;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 2px solid #eee;
  }

  tbody tr:hover {
    background-color: #f8f9fa;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-transform: capitalize;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-out;
  background-color: ${props => {
    switch(props.status) {
      case 'Retire': return '#f1c40f';
      case 'Pending': return '#3498db';
      case 'Preselectionne': return '#2ecc71';
      case 'Entretient': return '#9b59b6';
      case 'En Processus d\'entretient': return '#e67e22';
      case 'En negotiation': return '#1abc9c';
      case 'Recrute': return '#27ae60';
      default: return '#95a5a6';
    }
  }};
`;

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    background-color: #f0f0f0;
    color: #2c3e50;
  }
`;

const MenuContent = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  position: absolute;
  right: 0;
  background-color: white;
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  z-index: 100;
  border-radius: 8px;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;
`;

const MenuItem = styled.div`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #2c3e50;
  font-size: 14px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background-color: #f5f5f5;
    border-left-color: ${props => {
      if (props.variant === 'reject') return '#e74c3c';
      if (props.variant === 'previous') return '#f39c12';
      return '#2ecc71';
    }};
  }

  svg {
    color: ${props => {
      if (props.variant === 'reject') return '#e74c3c';
      if (props.variant === 'previous') return '#f39c12';
      return '#2ecc71';
    }};
  }
`;

// ------------------ Main Component -------------------

const OffreDetail = ({ offre, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState('Preselectionne');
  const [openMenu, setOpenMenu] = useState(null);
  const [isSendingLinks, setIsSendingLinks] = useState(false);
  const [deadline, setDeadline] = useState(7);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [levelStep, setLevelStep] = useState('Facile');

  const levelOrder = ['Facile', 'Moyen', 'Difficile'];

  const addQuestion = () => {
    const levelCount = questions.filter(q => q.level === levelStep).length;
    if (newQuestionText.trim() === '') return;
    if (levelCount >= 5) {
      alert(`Déjà 5 questions de niveau ${levelStep}`);
      return;
    }

    setQuestions(prev => [...prev, { text: newQuestionText, level: levelStep }]);
    setNewQuestionText('');
  };

  const removeQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(questions.length / 5)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const confirmCurrentPage = () => {
    const levelCount = questions.filter(q => q.level === levelStep).length;
    if (levelCount < 5) {
      alert(`Ajoutez encore ${5 - levelCount} questions de niveau ${levelStep}`);
      return;
    }

    const nextLevelIndex = levelOrder.indexOf(levelStep) + 1;
    if (nextLevelIndex < levelOrder.length) {
      setLevelStep(levelOrder[nextLevelIndex]);
      setCurrentPage(1);
    } else {
      setShowQuestionModal(false);
    }
  };

  const [newQuestion, setNewQuestion] = useState({ text: '', level: 'Facile' });

  const handleStatusChange = (candidatId, newStatus) => {
    if (onStatusChange) onStatusChange(candidatId, newStatus);
    setOpenMenu(null);
  };

  const toggleMenu = (candidatId) => {
    setOpenMenu(openMenu === candidatId ? null : candidatId);
  };

  const sendInterviewLinks = () => {
    setIsSendingLinks(true);
    setTimeout(() => {
      alert(`Liens d'entretien envoyés (délai : ${deadline} jours)`);
      setIsSendingLinks(false);
    }, 1500);
  };

  const getAvailableTransitions = (currentStatus) => {
    const transitions = {
      Retire: [{ status: 'Pending', label: 'Remettre en attente', icon: <FaArrowRight />, variant: 'next' }],
      Pending: [
        { status: 'Preselectionne', label: 'Preselectionner', icon: <FaArrowRight />, variant: 'next' },
        { status: 'Retire', label: 'Rejeter', icon: <FaTimes />, variant: 'reject' }
      ],
      Preselectionne: [
        { status: 'Entretient', label: 'Programmer entretien', icon: <FaArrowRight />, variant: 'next' },
        { status: 'Pending', label: 'Retour en attente', icon: <FaArrowLeft />, variant: 'previous' },
        { status: 'Retire', label: 'Rejeter', icon: <FaTimes />, variant: 'reject' }
      ],
      Entretient: [
        { status: 'En Processus d\'entretient', label: 'Continuer processus', icon: <FaArrowRight />, variant: 'next' },
        { status: 'Preselectionne', label: 'Annuler entretien', icon: <FaArrowLeft />, variant: 'previous' },
        { status: 'Retire', label: 'Rejeter', icon: <FaTimes />, variant: 'reject' }
      ],
      'En Processus d\'entretient': [
        { status: 'En negotiation', label: 'Négocier', icon: <FaArrowRight />, variant: 'next' },
        { status: 'Entretient', label: 'Retour à entretien', icon: <FaArrowLeft />, variant: 'previous' },
        { status: 'Retire', label: 'Rejeter', icon: <FaTimes />, variant: 'reject' }
      ],
      'En negotiation': [
        { status: 'Recrute', label: 'Recruter', icon: <FaArrowRight />, variant: 'next' },
        { status: 'En Processus d\'entretient', label: 'Retour à processus', icon: <FaArrowLeft />, variant: 'previous' },
        { status: 'Retire', label: 'Rejeter', icon: <FaTimes />, variant: 'reject' }
      ],
      Recrute: [
        { status: 'Retire', label: 'Annuler recrutement', icon: <FaTimes />, variant: 'reject' }
      ]
    };
    return transitions[currentStatus] || [];
  };

  const getAllPossibleStatuses = () => {
    return ['Retire', 'Pending', 'Preselectionne', 'Entretient', 'En Processus d\'entretient', 'En negotiation', 'Recrute'];
  };

  const filteredCandidats = offre?.candidats?.filter(c => c.status === selectedStatus) || [];
  const interviewCandidatesCount = offre?.candidats?.filter(c => c.status === 'Entretient').length || 0;



  return (
    <Container>
      <ColumnLeft>
        <h1>{offre.titre}</h1>
        <p>{offre.description}</p>
        <p>📍 Lieu: {offre.lieu}</p>
        <p>📄 Type de contrat: {offre.typeContrat}</p>
        <h2>Entreprise</h2>
        <p>🏢 Nom: {offre.entreprise.nom}</p>
        <p>📘 Description: {offre.entreprise.description}</p>
        <p>📧 Contact: {offre.entreprise.contact.email}</p>
      </ColumnLeft>

      <ColumnRight>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0 }}>Candidats</h2>
            <SendInterviewButton onClick={() => setShowQuestionModal(true)}>
              🎤 Gérer les Questions
            </SendInterviewButton>
          </div>
        </div>
        <ButtonGroup>
          {getAllPossibleStatuses().map(status => (
            <button 
              key={status} 
              onClick={() => setSelectedStatus(status)}
              className={selectedStatus === status ? 'active' : ''}
            >
              {status}
            </button>
          ))}
        </ButtonGroup>

        {selectedStatus === 'Entretient' && interviewCandidatesCount > 0 && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
            <SendInterviewButton 
              onClick={sendInterviewLinks}
              disabled={isSendingLinks}
            >
              {isSendingLinks ? 'Envoi en cours...' : <><FaPaperPlane /> Envoyer les liens d'entretien</>}
            </SendInterviewButton>
            <select 
              value={deadline}
              onChange={(e) => setDeadline(Number(e.target.value))}
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value={3}>3 jours</option>
              <option value={7}>7 jours</option>
              <option value={14}>14 jours</option>
            </select>
          </div>
        )}

        <Table>
          <thead>
            <tr>
              <th>Nom complet</th>
              <th>Université</th>
              <th>Diplome</th>
              <th>Filière</th>
              <th>Matching Score</th>
              <th>Date de candidature</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidats.map((candidat) => (
              <tr key={candidat.id}>
                <td>{candidat.nomComplet}</td>
                <td>{candidat.universite}</td>
                <td>{candidat.diplome}</td>
                <td>{candidat.filiere}</td>
                <td>{candidat.matchingScore}</td>
                <td>{candidat.dateCandidature}</td>
                <td>
                  <StatusBadge status={candidat.status}>
                    {candidat.status}
                  </StatusBadge>
                </td>
                <td>
                  <ActionMenu>
                    <MenuButton onClick={() => toggleMenu(candidat.id)}>
                      <FaEllipsisH />
                    </MenuButton>
                    <MenuContent show={openMenu === candidat.id}>
                      {getAvailableTransitions(candidat.status).map((action) => (
                        <MenuItem 
                          key={action.status}
                          onClick={() => handleStatusChange(candidat.id, action.status)}
                          variant={action.variant}
                        >
                          {action.icon} {action.label}
                        </MenuItem>
                      ))}
                    </MenuContent>
                  </ActionMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {showQuestionModal && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  }}>
    <div style={{
      background: '#ffffff',
      padding: '30px 35px',
      borderRadius: '16px',
      width: '600px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <h2 style={{
        fontSize: '20px',
        marginBottom: '20px',
        color: '#2c3e50',
        fontWeight: '600',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
      }}>
        🎯 Questions ({questions.length}/15) — Niveau: <span style={{ color: '#3498db' }}>{levelStep}</span>
      </h2>

      {questions.filter(q => q.level === levelStep).length < 5 && (
        <>
          <input
            type="text"
            placeholder="Entrez une nouvelle question..."
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: '12px'
            }}
          />
          <button
            onClick={addQuestion}
            style={{
              padding: '10px 18px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'background 0.3s'
            }}
          >
            ➕ Ajouter
          </button>
        </>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {questions
          .filter(q => q.level === levelStep)
          .slice((currentPage - 1) * 5, currentPage * 5)
          .map((q, idx) => {
            const indexToRemove = questions.findIndex(
              (item, i) =>
                item.text === q.text &&
                item.level === q.level &&
                i >= (currentPage - 1) * 5
            );
            return (
              <li key={idx} style={{
                marginBottom: '12px',
                borderBottom: '1px solid #f0f0f0',
                paddingBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#333' }}>
                  <strong style={{ color: '#888' }}>{q.level}:</strong> {q.text}
                </span>
                <button
                  onClick={() => removeQuestion(indexToRemove)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#e74c3c',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  ✖
                </button>
              </li>
            );
          })}
      </ul>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            backgroundColor: currentPage === 1 ? '#ecf0f1' : '#95a5a6',
            color: '#fff',
            border: 'none',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s'
          }}
        >
          ⬅ Précédent
        </button>
        <span style={{ fontSize: '13px', color: '#555' }}>
          Page {currentPage} / {Math.ceil(questions.filter(q => q.level === levelStep).length / 5) || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(questions.filter(q => q.level === levelStep).length / 5)}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            backgroundColor: currentPage === Math.ceil(questions.filter(q => q.level === levelStep).length / 5) ? '#ecf0f1' : '#95a5a6',
            color: '#fff',
            border: 'none',
            cursor: currentPage === Math.ceil(questions.filter(q => q.level === levelStep).length / 5) ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s'
          }}
        >
          Suivant ➡
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px' }}>
        <button
          onClick={confirmCurrentPage}
          style={{
            padding: '10px 16px',
            backgroundColor: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            marginRight: '12px',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
        >
          ✅ Confirmer
        </button>
        <button
          onClick={() => setShowQuestionModal(false)}
          style={{
            padding: '10px 16px',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          ❌ Fermer
        </button>
      </div>
    </div>
  </div>
)}


      </ColumnRight>
    </Container>
  );
};

export default OffreDetail;
