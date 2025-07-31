import React from 'react';
import styled from 'styled-components';
import TemplateCan from '../CandidatNavbar/TemplateCan';
import { FaUserTie, FaFileAlt, FaCalendarCheck, FaStar } from 'react-icons/fa';

const DashboardContainer = styled.div`
  padding: 40px;
  font-family: 'Montserrat', sans-serif;
  background-color: #f4f7fc;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
  color: #2f3e46;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.1);
  }
`;

const Icon = styled.div`
  font-size: 36px;
  color: #4cc9f0;
  margin-bottom: 10px;
`;

const CardTitle = styled.h2`
  font-size: 20px;
  margin: 10px 0;
  color: #1d3557;
`;

const CardText = styled.p`
  font-size: 14px;
  color: #6c757d;
`;


const CandidatDashboard = () => {
  return (
    <TemplateCan>
      <DashboardContainer>
        <Title>👤 Welcome to Your Dashboard</Title>
        <Grid>
          <Card>
            <Icon><FaUserTie /></Icon>
            <CardTitle>My Profile</CardTitle>
            <CardText>Update your personal info and CV.</CardText>
          </Card>

          <Card>
            <Icon><FaFileAlt /></Icon>
            <CardTitle>Applications</CardTitle>
            <CardText>Track your job applications in real-time.</CardText>
          </Card>

          <Card>
            <Icon><FaCalendarCheck /></Icon>
            <CardTitle>Interviews</CardTitle>
            <CardText>Check your upcoming interviews.</CardText>
          </Card>

          <Card>
            <Icon><FaStar /></Icon>
            <CardTitle>Recommendations</CardTitle>
            <CardText>View endorsements and ratings.</CardText>
          </Card>
        </Grid>
      </DashboardContainer>
    </TemplateCan>
  );
};

export default CandidatDashboard;
