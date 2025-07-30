import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../Logo/image.png'; // Replace with your actual logo path
import miniLogo from '../Logo/Capture_d_écran_2025-07-28_012749-removebg-preview.png'; // Replace with your mini logo path


const NavContainer = styled.nav`
  background-color: #fff;
  border-bottom: 1px solid #f3f4f6;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  z-index: 60;
`;

const LogoImg = styled.img`
  height: 2.5rem;
  width: auto;
`;

const NavList = styled.ul`
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  
  @media (min-width: 768px) {
    display: flex;
    gap: 2rem;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled.a`
  color: #4b5563;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: #2563eb;
  }
`;

const NavUnderline = styled.span`
  position: absolute;
  bottom: 0;
  height: 2px;
  background-color: #2563eb;
  width: 0;
  transition: width 0.2s ease;
  
  ${NavItem}:hover & {
    width: 100%;
  }
`;

const RightSection = styled.div`
  display: none;
  align-items: center;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

const MiniLogo = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const MobileMenuButton = styled.button`
  display: block;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #4b5563;
  cursor: pointer;
  z-index: 60;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 50;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuItem = styled.li`
  list-style: none;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
`;

const MobileMenuLink = styled.a`
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  display: block;
  
  &:hover {
    color: #2563eb;
  }
`;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <NavContainer>
      <NavContent>
        <LogoLink href="/">
          <LogoImg src={logo} alt="JobGate Logo" />
        </LogoLink>

        <NavList>
          {['Tableau de bord', 'Créer une offre', 'Gérer les offres'].map((item) => (
            <NavItem key={item}>
              <NavLink>
                {item}
                <NavUnderline />
              </NavLink>
            </NavItem>
          ))}
        </NavList>
        <RightSection>
          <MiniLogo src={miniLogo} alt="User Profile" />
        </RightSection>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <>&#10005;</> : <>&#9776;</>}
        </MobileMenuButton>
      </NavContent>

      {mobileMenuOpen && (
        <MobileMenu>
          {['Tableau de bord', 'Créer une offre', 'Gérer les offres'].map((item) => (
            <MobileMenuItem key={item}>
              <MobileMenuLink href="#">{item}</MobileMenuLink>
            </MobileMenuItem>
          ))}
        </MobileMenu>
      )}
    </NavContainer>
  );
};



export default Navbar;