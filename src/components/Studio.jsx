import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, Download, Undo2, Redo2, Type, Image as ImageIcon, 
  Trash2, ChevronLeft, ZoomIn, ZoomOut, Maximize2, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, 
  ChevronUp, ChevronDown, Sparkles
} from 'lucide-react';
import html2canvas from 'html2canvas';

const FORMATS = [
  { id: '80x210', name: 'XPrinter 80×210', size: '80 × 210 mm', class: 'format-80x210', printClass: 'format-80x210-print' },
  { id: '80x297', name: 'XPrinter 80×297', size: '80 × 297 mm', class: 'format-80x297', printClass: 'format-80x297-print' },
  { id: 'A4', name: 'Standard A4', size: '210 × 297 mm', class: 'format-A4', printClass: 'format-A4-print' },
  { id: 'A5', name: 'Standard A5', size: '148 × 210 mm', class: 'format-A5', printClass: 'format-A5-print' },
  { id: 'photo4x6', name: 'Photo 4×6', size: '101.6 × 152.4 mm', class: 'format-photo4x6', printClass: 'format-photo4x6-print' },
  { id: 'square80x80', name: 'Square 80×80', size: '80 × 80 mm', class: 'format-square80x80', printClass: 'format-square80x80-print' }
];

const FONTS = ['Inter', 'Outfit', 'Playfair Display', 'Courier New', 'Georgia'];
const COLORS = ['#232931', '#8b5cf6', '#06b6d4', '#ff4757', '#2ed573', '#ffa502'];

export default function Studio({ initialTemplate, onBackToHome }) {
  const [paperFormat, setPaperFormat] = useState('80x297');
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [zoom, setZoom] = useState(1);
  
  // History state
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const dragStartRef = useRef({ x: 0, y: 0, elX: 0, elY: 0, width: 0, height: 0, action: null });
  const sheetRef = useRef(null);

  // Load template if provided
  useEffect(() => {
    if (initialTemplate) {
      setPaperFormat(initialTemplate.format || '80x297');
      setElements(initialTemplate.elements || []);
      // Initialize history with template
      setHistory([initialTemplate.elements || []]);
      setHistoryIndex(0);
    } else {
      // blank sheet setup
      setElements([]);
      setHistory([[]]);
      setHistoryIndex(0);
    }
  }, [initialTemplate]);

  // Helper to push history
  const pushToHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newElements)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(JSON.parse(JSON.stringify(history[historyIndex - 1])));
      setSelectedId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(JSON.parse(JSON.stringify(history[historyIndex + 1])));
      setSelectedId(null);
    }
  };

  // Add text element
  const handleAddText = () => {
    const activeFormat = FORMATS.find(f => f.id === paperFormat);
    const newEl = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Matnni kiriting',
      x: 30,
      y: 50,
      width: 200,
      height: 40,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: '500',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#232931'
    };
    const updated = [...elements, newEl];
    setElements(updated);
    setSelectedId(newEl.id);
    pushToHistory(updated);
  };

  // Add image element
  const handleAddImage = () => {
    const newEl = {
      id: `image-${Date.now()}`,
      type: 'image',
      src: '', // empty to trigger upload placeholder
      x: 30,
      y: 100,
      width: 150,
      height: 150
    };
    const updated = [...elements, newEl];
    setElements(updated);
    setSelectedId(newEl.id);
    pushToHistory(updated);
  };

  // Delete element
  const handleDeleteElement = (id) => {
    const updated = elements.filter(el => el.id !== id);
    setElements(updated);
    if (selectedId === id) setSelectedId(null);
    pushToHistory(updated);
  };

  // Update properties of selected element
  const updateElementProp = (id, prop, value) => {
    const updated = elements.map(el => {
      if (el.id === id) {
        return { ...el, [prop]: value };
      }
      return el;
    });
    setElements(updated);
  };

  // Save to history on property changes completion
  const handlePropChangeComplete = () => {
    pushToHistory(elements);
  };

  // Draggable / Resizable Mouse Listeners
  const handleElementMouseDown = (e, el, action) => {
    e.stopPropagation();
    setSelectedId(el.id);

    // If this text element is currently being edited, don't start dragging
    if (editingId === el.id && action === 'drag') {
      return;
    }
    
    // Disable text selection drag during sizing/dragging
    e.preventDefault();

    const clientX = e.clientX;
    const clientY = e.clientY;

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      elX: el.x,
      elY: el.y,
      width: el.width,
      height: el.height,
      action: action // 'drag' or 'resize'
    };

    document.addEventListener('mousemove', handleElementMouseMove);
    document.addEventListener('mouseup', handleElementMouseUp);
  };

  const handleElementMouseMove = (e) => {
    const start = dragStartRef.current;
    if (!start.action) return;

    // Adjust delta based on zoom level to ensure accurate movement
    const dx = (e.clientX - start.x) / zoom;
    const dy = (e.clientY - start.y) / zoom;

    if (start.action === 'drag') {
      const newX = Math.max(0, start.elX + dx);
      const newY = Math.max(0, start.elY + dy);
      
      setElements(prev => prev.map(el => {
        if (el.id === selectedId) {
          return { ...el, x: Math.round(newX), y: Math.round(newY) };
        }
        return el;
      }));
    } else if (start.action === 'resize') {
      const newWidth = Math.max(30, start.width + dx);
      const newHeight = Math.max(20, start.height + dy);

      setElements(prev => prev.map(el => {
        if (el.id === selectedId) {
          return { ...el, width: Math.round(newWidth), height: Math.round(newHeight) };
        }
        return el;
      }));
    }
  };

  const handleElementMouseUp = () => {
    document.removeEventListener('mousemove', handleElementMouseMove);
    document.removeEventListener('mouseup', handleElementMouseUp);
    
    if (dragStartRef.current.action) {
      pushToHistory(elements);
    }
    dragStartRef.current.action = null;
  };

  // Image Upload handler
  const handleImageUpload = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateElementProp(id, 'src', event.target.result);
        // save to history
        setTimeout(() => pushToHistory(elements), 50);
      };
      reader.readAsDataURL(file);
    }
  };

  // Text content change handler
  const handleTextChange = (e, id) => {
    updateElementProp(id, 'content', e.target.innerText);
  };

  // Layer ordering
  const moveLayer = (id, direction) => {
    const index = elements.findIndex(el => el.id === id);
    if (index === -1) return;

    const newElements = [...elements];
    if (direction === 'up' && index < elements.length - 1) {
      const temp = newElements[index];
      newElements[index] = newElements[index + 1];
      newElements[index + 1] = temp;
    } else if (direction === 'down' && index > 0) {
      const temp = newElements[index];
      newElements[index] = newElements[index - 1];
      newElements[index - 1] = temp;
    }

    setElements(newElements);
    pushToHistory(newElements);
  };

  // Export to Image (PNG)
  const handleSaveImage = () => {
    const sheetElement = sheetRef.current;
    if (!sheetElement) return;

    // Temporarily deselect element
    const prevSelected = selectedId;
    setSelectedId(null);

    // Give react brief moment to clear borders
    setTimeout(() => {
      html2canvas(sheetElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `hvn_studio_${paperFormat}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restore selection
        setSelectedId(prevSelected);
      }).catch(err => {
        console.error('Error saving image:', err);
        setSelectedId(prevSelected);
      });
    }, 100);
  };

  // Print function
  const handlePrint = () => {
    const prevSelected = selectedId;
    setSelectedId(null);

    // Wait for highlight borders to disappear
    setTimeout(() => {
      window.print();
      setSelectedId(prevSelected);
    }, 100);
  };

  const selectedElement = elements.find(el => el.id === selectedId);
  const activeFormatInfo = FORMATS.find(f => f.id === paperFormat);

  return (
    <div className="studio-layout">
      {/* Sidebar Controls Panel */}
      <div className="studio-sidebar no-print">
        <div className="studio-header">
          <div className="studio-logo">
            <Printer size={20} />
          </div>
          <div className="logo-text">
            <h3>HVN Studio</h3>
            <span>Pro Printer</span>
          </div>
        </div>

        {/* Element Tools */}
        <div className="panel-section">
          <span className="panel-title">Element Qoʻshish</span>
          <div className="add-tools-grid">
            <button className="glass-btn btn-purple tool-btn" onClick={handleAddText}>
              <Type size={20} style={{ marginBottom: '4px' }} />
              MATN
            </button>
            <button className="glass-btn btn-cyan tool-btn" onClick={handleAddImage}>
              <ImageIcon size={20} style={{ marginBottom: '4px' }} />
              RASM
            </button>
          </div>
        </div>

        {/* Undo/Redo tools */}
        <div className="panel-section">
          <span className="panel-title">Tahrirlash Tarixi</span>
          <div className="history-grid">
            <button 
              className="glass-btn" 
              onClick={handleUndo} 
              disabled={historyIndex === 0}
              style={{ opacity: historyIndex === 0 ? 0.4 : 1 }}
            >
              <Undo2 size={16} />
              Orqaga
            </button>
            <button 
              className="glass-btn" 
              onClick={handleRedo} 
              disabled={historyIndex === history.length - 1}
              style={{ opacity: historyIndex === history.length - 1 ? 0.4 : 1 }}
            >
              <Redo2 size={16} />
              Oldinga
            </button>
          </div>
        </div>

        {/* Selected Element Properties inside Sidebar */}
        {selectedElement && (
          <div className="panel-section" style={{ border: '1px dashed rgba(139, 92, 246, 0.3)', padding: '12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)' }}>
            <span className="panel-title" style={{ fontSize: '0.8rem', color: 'var(--purple-dark)' }}>
              {selectedElement.type === 'text' ? 'Matn Sozlamalari' : 'Rasm Sozlamalari'}
            </span>
            
            {selectedElement.type === 'text' ? (
              <>
                {/* Font Size */}
                <div className="property-group">
                  <label className="property-label">Shrift oʻlchami ({selectedElement.fontSize}px)</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="80" 
                    value={selectedElement.fontSize}
                    onChange={(e) => updateElementProp(selectedElement.id, 'fontSize', parseInt(e.target.value))}
                    onMouseUp={handlePropChangeComplete}
                    onTouchEnd={handlePropChangeComplete}
                    className="liquid-input"
                    style={{ padding: '0', height: '8px', width: '100%' }}
                  />
                </div>

                {/* Font Family */}
                <div className="property-group">
                  <label className="property-label">Shrift Oilasi</label>
                  <select 
                    className="liquid-select"
                    value={selectedElement.fontFamily}
                    onChange={(e) => {
                      updateElementProp(selectedElement.id, 'fontFamily', e.target.value);
                      pushToHistory(elements.map(el => el.id === selectedElement.id ? { ...el, fontFamily: e.target.value } : el));
                    }}
                    style={{ width: '100%', padding: '6px' }}
                  >
                    {FONTS.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Text Alignment */}
                <div className="property-group">
                  <label className="property-label">Tekislash</label>
                  <div className="button-group-row">
                    <button 
                      className={`glass-btn prop-icon-btn ${selectedElement.textAlign === 'left' ? 'active' : ''}`}
                      onClick={() => {
                        updateElementProp(selectedElement.id, 'textAlign', 'left');
                        pushToHistory(elements.map(el => el.id === selectedElement.id ? { ...el, textAlign: 'left' } : el));
                      }}
                      style={{ padding: '6px' }}
                    >
                      <AlignLeft size={14} />
                    </button>
                    <button 
                      className={`glass-btn prop-icon-btn ${selectedElement.textAlign === 'center' ? 'active' : ''}`}
                      onClick={() => {
                        updateElementProp(selectedElement.id, 'textAlign', 'center');
                        pushToHistory(elements.map(el => el.id === selectedElement.id ? { ...el, textAlign: 'center' } : el));
                      }}
                      style={{ padding: '6px' }}
                    >
                      <AlignCenter size={14} />
                    </button>
                    <button 
                      className={`glass-btn prop-icon-btn ${selectedElement.textAlign === 'right' ? 'active' : ''}`}
                      onClick={() => {
                        updateElementProp(selectedElement.id, 'textAlign', 'right');
                        pushToHistory(elements.map(el => el.id === selectedElement.id ? { ...el, textAlign: 'right' } : el));
                      }}
                      style={{ padding: '6px' }}
                    >
                      <AlignRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Font Style weight */}
                <div className="property-group">
                  <label className="property-label">Uslub</label>
                  <div className="button-group-row">
                    <button 
                      className={`glass-btn prop-icon-btn ${selectedElement.fontWeight === '700' ? 'active' : ''}`}
                      onClick={() => {
                        const newWeight = selectedElement.fontWeight === '700' ? '500' : '700';
                        updateElementProp(selectedElement.id, 'fontWeight', newWeight);
                        pushToHistory(elements.map(el => el.id === selectedElement.id ? { ...el, fontWeight: newWeight } : el));
                      }}
                      style={{ padding: '6px' }}
                    >
                      <Bold size={14} />
                    </button>
                    <button 
                      className={`glass-btn prop-icon-btn ${selectedElement.fontStyle === 'italic' ? 'active' : ''}`}
                      onClick={() => {
                        const newStyle = selectedElement.fontStyle === 'italic' ? 'normal' : 'italic';
                        updateElementProp(selectedElement.id, 'fontStyle', newStyle);
                        pushToHistory(elements.map(el => el.id === selectedElement.id ? { ...el, fontStyle: newStyle } : el));
                      }}
                      style={{ padding: '6px' }}
                    >
                      <Italic size={14} />
                    </button>
                  </div>
                </div>

                {/* Colors */}
                <div className="property-group">
                  <label className="property-label">Rang</label>
                  <div className="color-selector">
                    {COLORS.map(c => (
                      <div
                        key={c}
                        className={`color-dot ${selectedElement.color === c ? 'active' : ''}`}
                        style={{ backgroundColor: c, width: '18px', height: '18px' }}
                        onClick={() => {
                          updateElementProp(selectedElement.id, 'color', c);
                          pushToHistory(elements.map(el => el.id === selectedElement.id ? { ...el, color: c } : el));
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Layer Ordering and Delete */}
                <div className="property-group" style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '8px' }}>
                  <label className="property-label">Qatlam Tartibi</label>
                  <div className="button-group-row" style={{ marginBottom: '8px' }}>
                    <button className="glass-btn prop-icon-btn" onClick={() => moveLayer(selectedElement.id, 'up')} style={{ padding: '6px', fontSize: '0.75rem' }}>
                      <ChevronUp size={12} />
                      Ustiga
                    </button>
                    <button className="glass-btn prop-icon-btn" onClick={() => moveLayer(selectedElement.id, 'down')} style={{ padding: '6px', fontSize: '0.75rem' }}>
                      <ChevronDown size={12} />
                      Ostiga
                    </button>
                  </div>
                  <button 
                    className="glass-btn" 
                    style={{ width: '100%', borderColor: '#ff4757', color: '#ff4757', background: 'rgba(255, 71, 87, 0.05)', fontSize: '0.75rem', padding: '6px 12px' }}
                    onClick={() => handleDeleteElement(selectedElement.id)}
                  >
                    <Trash2 size={12} />
                    Oʻchirish
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="property-group">
                  <label className="property-label">Harakatlar</label>
                  <div className="button-group-row" style={{ marginBottom: '8px' }}>
                    <button className="glass-btn prop-icon-btn" onClick={() => moveLayer(selectedElement.id, 'up')} style={{ padding: '6px', fontSize: '0.75rem' }}>
                      <ChevronUp size={12} />
                      Ustiga
                    </button>
                    <button className="glass-btn prop-icon-btn" onClick={() => moveLayer(selectedElement.id, 'down')} style={{ padding: '6px', fontSize: '0.75rem' }}>
                      <ChevronDown size={12} />
                      Ostiga
                    </button>
                  </div>
                  <button 
                    className="glass-btn" 
                    style={{ width: '100%', borderColor: '#ff4757', color: '#ff4757', background: 'rgba(255, 71, 87, 0.05)', fontSize: '0.75rem', padding: '6px 12px' }}
                    onClick={() => handleDeleteElement(selectedElement.id)}
                  >
                    <Trash2 size={12} />
                    Oʻchirish
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Paper Formats */}
        <div className="panel-section">
          <span className="panel-title">Qogʻoz Formati</span>
          <div className="format-grid">
            {FORMATS.map(f => (
              <div 
                className={`format-option ${paperFormat === f.id ? 'active' : ''}`}
                key={f.id}
                onClick={() => {
                  setPaperFormat(f.id);
                  // Push state change to history
                  const updated = elements;
                  pushToHistory(updated);
                }}
              >
                <span className="format-name">{f.name}</span>
                <span className="format-size">{f.size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Print / Export Action Buttons */}
        <div className="action-buttons">
          <button className="glass-btn btn-purple btn-main-action" onClick={handlePrint}>
            <Printer size={20} />
            CHOP ETISH
          </button>
          
          <button className="glass-btn btn-cyan btn-main-action" onClick={handleSaveImage}>
            <Download size={20} />
            SAHIFANI SAQLASH
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace Container */}
      <div className="studio-workspace">
        {/* Ambient background decorations matching prompt aesthetics */}
        <div className="organic-blob no-print" style={{ width: '400px', height: '400px', left: '-5%', top: '25%', opacity: 0.15, pointerEvents: 'none' }}></div>
        <img 
          src="/glass_purple_sofa.jpg" 
          alt="" 
          className="floating-sofa no-print" 
          style={{ 
            opacity: 0.15, 
            pointerEvents: 'none', 
            position: 'absolute', 
            left: '30px', 
            bottom: '30px', 
            width: '160px', 
            height: '160px', 
            zIndex: 1,
            borderRadius: '24px'
          }} 
        />
        <img 
          src="/glass_round_table.jpg" 
          alt="" 
          className="floating-table no-print" 
          style={{ 
            opacity: 0.12, 
            pointerEvents: 'none', 
            position: 'absolute', 
            right: '30px', 
            top: '120px', 
            width: '130px', 
            height: '130px', 
            zIndex: 1,
            borderRadius: '24px'
          }} 
        />
        {/* Workspace Top Toolbar */}
        <div className="workspace-toolbar no-print">
          <div className="zoom-controls">
            <button className="nav-item" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} style={{ width: '36px', height: '36px' }}>
              <ZoomOut size={16} />
            </button>
            <span className="zoom-value">{Math.round(zoom * 100)}%</span>
            <button className="nav-item" onClick={() => setZoom(Math.min(2.5, zoom + 0.25))} style={{ width: '36px', height: '36px' }}>
              <ZoomIn size={16} />
            </button>
            <button className="nav-item" onClick={() => setZoom(1)} style={{ width: '36px', height: '36px' }} title="Reset Zoom">
              <Maximize2 size={14} />
            </button>
          </div>

          <div className="format-badge">
            {activeFormatInfo?.name} ({activeFormatInfo?.size})
          </div>
        </div>

        {/* Scrollable grid area for sheet */}
        <div className="canvas-scroll-container" onClick={() => { setSelectedId(null); setEditingId(null); }}>
          {/* Print container wrapping print sheet */}
          <div className="print-wrapper">
            <div 
              ref={sheetRef}
              id="printable-canvas-sheet"
              className={`printable-sheet ${activeFormatInfo?.class} ${activeFormatInfo?.printClass}`}
              style={{ transform: `scale(${zoom})` }}
            >
              {elements.map(el => (
                <div
                  key={el.id}
                  className={`canvas-element ${selectedId === el.id ? 'selected' : ''}`}
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    zIndex: elements.indexOf(el) + 10
                  }}
                  onMouseDown={(e) => handleElementMouseDown(e, el, 'drag')}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Delete layer button */}
                  <button 
                    className="delete-el-btn no-print" 
                    onClick={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }}
                  >
                    ×
                  </button>

                  {/* Render layer content */}
                  {el.type === 'text' ? (
                    <div
                      className="element-text-content"
                      contentEditable={editingId === el.id}
                      suppressContentEditableWarning
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingId(el.id);
                        // Focus and place cursor at click position
                        setTimeout(() => {
                          const textDiv = e.target;
                          textDiv.focus();
                          // Place cursor at end
                          const range = document.createRange();
                          const sel = window.getSelection();
                          range.selectNodeContents(textDiv);
                          range.collapse(false);
                          sel.removeAllRanges();
                          sel.addRange(range);
                        }, 0);
                      }}
                      onBlur={(e) => {
                        handleTextChange(e, el.id);
                        setEditingId(null);
                        handlePropChangeComplete();
                      }}
                      style={{
                        fontSize: `${el.fontSize}px`,
                        fontFamily: el.fontFamily,
                        fontWeight: el.fontWeight,
                        fontStyle: el.fontStyle,
                        textAlign: el.textAlign,
                        color: el.color,
                        cursor: editingId === el.id ? 'text' : 'move',
                        minHeight: '1em'
                      }}
                    >
                      {el.content}
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '100%' }}>
                      {el.src ? (
                        <img src={el.src} alt="Uploaded block" className="canvas-image-el" />
                      ) : (
                        <label className="upload-placeholder no-print">
                          <ImageIcon size={24} />
                          <span>Rasm yuklash</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e, el.id)}
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {/* Resize handle dot */}
                  <div 
                    className="resize-handle no-print"
                    onMouseDown={(e) => handleElementMouseDown(e, el, 'resize')}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
