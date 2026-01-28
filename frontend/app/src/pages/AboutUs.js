import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const TEAM = [
  { name: 'Dimas Rizqullah Alkausar', initial: 'D' },
  { name: 'Luthfi Harry Satrio', initial: 'L' },
  { name: 'Naranatha Rikho', initial: 'N' },
  { name: 'Raihan Putra Wibowo', initial: 'R' },
  { name: 'Sulthon Ajuna Raihan', initial: 'S' },
];

export default function AboutUs() {
  return (
    <div className="about-page">
      <Link to="/" className="about-back">← Kembali ke Beranda</Link>

      <header className="about-page-header">
        <h1 className="about-page-title">About Us</h1>
        <p className="about-page-subtitle">Profil Tim</p>
      </header>

      <section className="about-profiles">
        <div className="about-profiles-row">
          {TEAM.slice(0, 2).map((p) => (
            <div key={p.name} className="about-profile">
              <div className="about-photo">{p.initial}</div>
              <span className="about-name">{p.name}</span>
            </div>
          ))}
        </div>
        <div className="about-profiles-row">
          {TEAM.slice(2, 5).map((p) => (
            <div key={p.name} className="about-profile">
              <div className="about-photo">{p.initial}</div>
              <span className="about-name">{p.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
