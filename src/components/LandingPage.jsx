import React from 'react';
import { Printer, ArrowRight, Sparkles, Layers, Edit } from 'lucide-react';

export default function LandingPage({ onOpenStudio }) {
  const templates = [
    {
      id: 'sofa-cake',
      title: 'Sofa cake',
      subtitle: 'My storehouse',
      description: 'Futuristic glass-morphic product label with price details and modern typography.',
      price: '$299',
      format: '80x210',
      elements: [
        {
          id: 't-1',
          type: 'text',
          content: 'SOFA CAKE',
          x: 20,
          y: 30,
          fontSize: 32,
          fontFamily: 'Outfit',
          fontWeight: '800',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#8b5cf6',
          width: 260,
          height: 50
        },
        {
          id: 't-2',
          type: 'text',
          content: 'MY STOREHOUSE',
          x: 20,
          y: 90,
          fontSize: 16,
          fontFamily: 'Inter',
          fontWeight: '600',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#57606f',
          width: 260,
          height: 30
        },
        {
          id: 't-3',
          type: 'text',
          content: 'Couch Capsule\nItem #4092-A',
          x: 40,
          y: 200,
          fontSize: 14,
          fontFamily: 'Inter',
          fontWeight: '500',
          fontStyle: 'normal',
          textAlign: 'left',
          color: '#232931',
          width: 220,
          height: 50
        },
        {
          id: 't-4',
          type: 'text',
          content: 'PRICE: $299',
          x: 40,
          y: 270,
          fontSize: 20,
          fontFamily: 'Outfit',
          fontWeight: '700',
          fontStyle: 'normal',
          textAlign: 'left',
          color: '#06b6d4',
          width: 220,
          height: 40
        },
        {
          id: 't-5',
          type: 'text',
          content: 'Scan to verify authenticity',
          x: 20,
          y: 700,
          fontSize: 12,
          fontFamily: 'Inter',
          fontWeight: '400',
          fontStyle: 'italic',
          textAlign: 'center',
          color: '#a4b0be',
          width: 260,
          height: 30
        }
      ]
    },
    {
      id: 'worktop-label',
      title: 'Worktop Pro',
      subtitle: 'Premium tag',
      description: 'Industrial-grade minimalist product sticker template showing code and dimension markers.',
      price: '$89',
      format: 'square80x80',
      elements: [
        {
          id: 'w-1',
          type: 'text',
          content: 'WORKTOP',
          x: 20,
          y: 20,
          fontSize: 26,
          fontFamily: 'Outfit',
          fontWeight: '700',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#232931',
          width: 260,
          height: 40
        },
        {
          id: 'w-2',
          type: 'text',
          content: 'COUCH CAPSULE',
          x: 20,
          y: 70,
          fontSize: 14,
          fontFamily: 'Inter',
          fontWeight: '600',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#8b5cf6',
          width: 260,
          height: 25
        },
        {
          id: 'w-3',
          type: 'text',
          content: 'SIZE: 80×80mm\nQTY: 1 UNIT',
          x: 30,
          y: 130,
          fontSize: 13,
          fontFamily: 'Inter',
          fontWeight: '500',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#57606f',
          width: 240,
          height: 40
        },
        {
          id: 'w-4',
          type: 'text',
          content: '★ PREMIUM QUALITY ★',
          x: 20,
          y: 240,
          fontSize: 11,
          fontFamily: 'Outfit',
          fontWeight: '600',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#06b6d4',
          width: 260,
          height: 20
        }
      ]
    },
    {
      id: 'couch-capsule',
      title: 'Couch Capsule',
      subtitle: 'Bespoke tag',
      description: 'Elegant script-oriented certificate or luxury brand tag with custom layout parameters.',
      price: '$149',
      format: '80x297',
      elements: [
        {
          id: 'c-1',
          type: 'text',
          content: 'Couch Capsule',
          x: 20,
          y: 40,
          fontSize: 32,
          fontFamily: 'Playfair Display',
          fontWeight: '700',
          fontStyle: 'italic',
          textAlign: 'center',
          color: '#232931',
          width: 260,
          height: 60
        },
        {
          id: 'c-2',
          type: 'text',
          content: 'COLLECTION 2026',
          x: 20,
          y: 110,
          fontSize: 12,
          fontFamily: 'Outfit',
          fontWeight: '600',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#8b5cf6',
          width: 260,
          height: 25
        },
        {
          id: 'c-3',
          type: 'text',
          content: 'This premium fabric product has been manufactured to the highest structural standards using glassmorphic aesthetic patterns.',
          x: 30,
          y: 180,
          fontSize: 13,
          fontFamily: 'Inter',
          fontWeight: '400',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#57606f',
          width: 240,
          height: 120
        },
        {
          id: 'c-4',
          type: 'text',
          content: 'ORIGINAL DESIGN',
          x: 20,
          y: 400,
          fontSize: 14,
          fontFamily: 'Outfit',
          fontWeight: '700',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#06b6d4',
          width: 260,
          height: 30
        }
      ]
    }
  ];

  return (
    <div className="app-container no-print">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="organic-blob"></div>
        <div className="hero-left">
          <h2>My storehouse</h2>
          <h1>Sofa cake</h1>
          <p className="hero-description">
            Experience the future of customized printing. HVN Printer Studio lets you draft, format, and print labels or designs in an interactive space utilizing an ultra-premium liquid-glass interface.
          </p>
          <div className="hero-actions">
            <button 
              className="glass-btn btn-purple btn-main-action"
              onClick={() => onOpenStudio(null)}
              style={{ borderRadius: '16px', padding: '16px 32px', width: 'auto' }}
            >
              <Printer size={20} />
              Studio-ni ochish
            </button>
            <a 
              href="#templates" 
              className="glass-btn"
              style={{ borderRadius: '16px', padding: '16px 24px', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
            >
              Andozalar
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="three-d-container">
            <div className="glow-ring"></div>
            {/* Using the generated glass sofa */}
            <img 
              src="/glass_purple_sofa.jpg" 
              alt="Isometric Glass Sofa" 
              className="floating-sofa" 
            />
            {/* Using the generated glass round table */}
            <img 
              src="/glass_round_table.jpg" 
              alt="Isometric Glass Table" 
              className="floating-table" 
            />
          </div>
        </div>
      </section>

      {/* Showcase Grid Section */}
      <section className="showcase-section" id="templates">
        <h3 className="showcase-title">Chop Etish Andozalari</h3>
        <p className="showcase-subtitle">Boshlangʻich nuqta sifatida bizning premium andozalarimizdan foydalaning.</p>

        <div className="showcase-grid">
          {templates.map((tpl) => (
            <div className="glass-card showcase-card glow-card-purple" key={tpl.id}>
              <div className="card-image-wrap">
                <div className="card-preview-canvas">
                  <div className="card-preview-title"></div>
                  <div className="card-preview-item" style={{ width: '90%' }}></div>
                  <div className="card-preview-item" style={{ width: '60%' }}></div>
                  <div className="card-preview-item" style={{ width: '80%' }}></div>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                    <div className="card-preview-item" style={{ width: '30%', background: '#06b6d4' }}></div>
                    <div className="card-preview-item" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
              <h4 className="card-title">{tpl.title}</h4>
              <p className="card-desc">{tpl.description}</p>
              <div className="card-footer">
                <span className="card-price">{tpl.price}</span>
                <button 
                  className="glass-btn btn-cyan" 
                  style={{ borderRadius: '12px', padding: '8px 16px' }}
                  onClick={() => onOpenStudio(tpl)}
                >
                  <Edit size={16} />
                  Tahrirlash
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
