import React, { useState, useEffect } from 'react';
import background from '../assets/background.gif';
import flanespada from '../assets/flanespada.gif';
import logo from '../assets/logo.png';
import './Lobby.css';

const Lobby = () => {
  const [copied, setCopied] = useState(false);
  const [serverStatus, setServerStatus] = useState("offline");
  const [playersOnline, setPlayersOnline] = useState(0);

  const copyIP = () => {
    navigator.clipboard.writeText('play.flancraft.com');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const fetchServerStatus = async () => {
    try {
      const response = await fetch('https://api.mcsrvstat.us/2/play.flancraft.com');
      const data = await response.json();
      setServerStatus(data.online ? "online" : "offline");
      setPlayersOnline(data.players ? data.players.online : 0);
    } catch (error) {
      console.error("Error fetching server status:", error);
      setServerStatus("offline");
      setPlayersOnline(0);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-background">
      <div className="background-container">
        <img src={background} alt="Background" className="background-image" />
        <div className="logo-and-info-container">
          <img src={logo} alt="Logo" className="hero-logo" />
          <div className="text-container">
            <h1 className="server-title">Flanium Network</h1>
            <div className="server-subtitle">Un universo único, creado solo para ti.</div>
            <div className="decorative-line-container">
              <div className="decorative-line left"></div>
              <div className="decorative-point"></div>
              <div className="decorative-line right"></div>
            </div>

            <div className={`server-info ${serverStatus}`}>
              <span>{`play.flancraft.com - Players Online: ${playersOnline || 0}`}</span>
              <div className={`server-status-indicator ${serverStatus}`}></div>
            </div>

            <button className={`play-button ${copied ? 'copied' : ''}`} onClick={copyIP}>
              {copied ? 'IP Copiada!' : 'Juega Ahora'}
            </button>
          </div>
        </div>
        <img src={flanespada} alt="Flan Espada" className="flan-espada" />
      </div>
    </div>
  );
};

export default Lobby;
