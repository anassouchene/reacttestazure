import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilSettings,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons';
import * as signalR from '@microsoft/signalr';

import { AppHeaderDropdown } from './header/index';
import './style.css';
import { Link } from 'react-router-dom';

const AppHeader = () => {
  const [showNotification, setShowNotification] = useState(true);
  const headerRef = useRef();
  const navLinkRef = useRef(); // Référence pour l'élément <a> contenant la classe "active"
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token'); // Vérifier si l'utilisateur est connecté

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });
  }, []);

  // Effectuer la connexion SignalR et gérer les notifications
  useEffect(() => {
    if (isAuthenticated) {
      // Charger les notifications de localStorage au montage du composant
      const savedNotifications = loadNotificationsFromLocalStorage();
      setNotifications(savedNotifications);
      setUnreadNotifications(savedNotifications.length);

      // Initialiser la connexion SignalR
      const userId = localStorage.getItem('idUser');
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`http://localhost:7295/notificationHub?userId=${userId}`, {
          accessTokenFactory: () => {
            const token = localStorage.getItem('token');
            return token ? `Bearer ${token}` : '';
          },
        })
        .withAutomaticReconnect()
        .build();

      // Démarrer la connexion SignalR
      connection
        .start()
        .then(() => {
          console.log('SignalR connected');
          // Écouter les notifications reçues
          connection.on('ReceiveNotification', (message) => {
            console.log('Notification received:', message);
            // Mettre à jour la liste des notifications
            setNotifications((prevNotifications) => {
              const updatedNotifications = [...prevNotifications, message];
              // Sauvegarder les notifications dans localStorage
              saveNotificationsToLocalStorage(updatedNotifications);
              return updatedNotifications;
            });
            // Mettre à jour le nombre de notifications non lues
            setUnreadNotifications((prevUnreadNotifications) => prevUnreadNotifications + 1);
            // Afficher le compteur de notifications
            setShowNotification(true);
            // Ajouter la classe "active" à l'élément <a> contenant la classe "notification-counter"
            if (navLinkRef.current) {
              navLinkRef.current.classList.add('active');
            }
          });
        })
        .catch((error) => console.error('SignalR connection error:', error));

      // Arrêter la connexion SignalR lorsque le composant est démonté
      return () => {
        connection.stop().then(() => console.log('SignalR disconnected'));
      };
    }
  }, [isAuthenticated]);

  // Fonction pour sauvegarder les notifications dans localStorage
  const saveNotificationsToLocalStorage = (notifications) => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  // Fonction pour charger les notifications de localStorage
  const loadNotificationsFromLocalStorage = () => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      return JSON.parse(savedNotifications);
    }
    return [];
  };

  // Fonction pour basculer l'état du dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    // Réinitialiser le nombre de notifications non lues
    setUnreadNotifications(0);
    // Masquer le compteur de notifications
    setShowNotification(false);
    // Supprimer les notifications du localStorage
    localStorage.removeItem('notifications');
    // Vider l'état des notifications
    setNotifications([]);
    // Retirer la classe "active" de l'élément <a> contenant la classe "notification-counter"
    if (navLinkRef.current) {
      navLinkRef.current.classList.remove('active');
    }
  };

  // Fonction pour gérer le clic sur une notification
  const handleNotificationClick = (notification) => {
    // Effectuer toute action nécessaire lorsque l'utilisateur clique sur une notification
    console.log('Notification clicked:', notification);
    // Supprimer la notification de la liste
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter((n) => n !== notification);
      // Sauvegarder les notifications mises à jour dans localStorage
      saveNotificationsToLocalStorage(updatedNotifications);
      // Mettre à jour le nombre de notifications non lues
      setUnreadNotifications(updatedNotifications.length);
      // Masquer le compteur de notifications si le nombre de notifications non lues est égal à 0
      if (updatedNotifications.length === 0) {
        setShowNotification(false);
      }
      return updatedNotifications;
    });
  };

  return (
    <CHeader
      position="sticky"
      className={`p-0 ${colorMode === 'dark' ? 'header-dark' : ''}`}
      ref={headerRef}
      style={{ backgroundColor: colorMode === 'dark' ? 'black' : '#f3f4f7' }}
    >
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Acceuil
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          {isAuthenticated && ( // Vérifier si l'utilisateur est connecté
            <CDropdown variant="nav-item" placement="bottom-end" isOpen={dropdownOpen} toggle={toggleDropdown}>
              <CDropdownToggle caret={false} onClick={toggleDropdown}>
                <CIcon icon={cilBell} size="lg" />
                {showNotification && (
                  <span className={`notification-counter ${unreadNotifications > 0 ? 'active' : ''}`}>
                    {unreadNotifications}
                  </span>
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                {notifications.length === 0 ? (
                  <CDropdownItem header="true">Pas de notifications</CDropdownItem>
                ) : (
                  notifications.map((notification, index) => (
                    <CDropdownItem key={index} onClick={() => handleNotificationClick(notification)}>
                      {notification}
                    </CDropdownItem>
                  ))
                )}
              </CDropdownMenu>
            </CDropdown>
          )}
          <CNavItem>
            <CNavLink href="#" ref={navLinkRef}> {/* Utiliser la référence pour l'élément <a> */}
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
          {isAuthenticated && ( // Vérifier si l'utilisateur est authentifié
            <CNavItem>
              <CDropdown variant="nav-item">
                <CDropdownToggle caret={false}>
                  <CIcon icon={cilSettings} size="lg" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem className="dropdown-item">
                    <Link to="/updatePassword" className="dropdown-link">
                      Modifier Mot de passe
                    </Link>
                  </CDropdownItem>

                </CDropdownMenu>
              </CDropdown>
            </CNavItem>
          )}

        </CHeaderNav>

        {/* Icône de mode couleur */}
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
        {/* Fin de l'icône de mode couleur */}
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;

