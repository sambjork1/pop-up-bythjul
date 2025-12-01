import React, { useState } from 'react';
import { Copy, Check, Eye, Code, Palette } from 'lucide-react';

export default function PopupDesigner() {
  const [activeTab, setActiveTab] = useState('design');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewStep, setPreviewStep] = useState('form'); // 'form' or 'success'
  
  const [config, setConfig] = useState({
    // Utseende
    primaryColor: '#FF6B6B',
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    
    // Innehåll
    headline: 'Få 10% rabatt!',
    description: 'Registrera din e-post och få en rabattkod direkt',
    buttonText: 'Få rabattkod',
    placeholder: 'Din e-postadress',
    
    // Rabattkod sida
    successHeadline: 'Tack! 🎉',
    successDescription: 'Här är din rabatkkod:',
    discountCode: 'BYTHJUL10',
    closeButtonText: 'Stäng',
    
    // Beteende
    showDelay: 3000, // millisekunder
    showOnScroll: false,
    scrollPercentage: 50,
    
    // API
    apiUrl: 'https://www.bythjul.com/api/misc/newsletter',
    
    // Base URL (ändra detta efter Vercel-deploy)
    baseUrl: 'https://bythjul-popup.vercel.app'
  });

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateConfigId = () => {
    return 'popup_' + Date.now();
  };

  const generateScript = () => {
    const configId = generateConfigId();
    return `<!-- Bythjul Popup Newsletter -->
<script>
(function() {
  'use strict';
  var script = document.createElement('script');
  script.src = 'https://www.bythjul.com/popup-loader.js?id=${configId}';
  script.defer = true;
  script.onload = function() { console.log('Bythjul popup loaded'); };
  script.onerror = function() { console.error('Failed to load Bythjul popup'); };
  document.head.appendChild(script);
})();
</script>

<!-- 
  CONFIG ID: ${configId}
  Spara denna config som: /popup-configs/${configId}.json
  
  Config innehåll:
  ${JSON.stringify(config, null, 2)}
-->`;
  };

  const copyScript = () => {
    navigator.clipboard.writeText(generateScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Popup Designer</h1>
          <p className="text-gray-600">Designa din newsletter popup och generera kod</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex-1 px-6 py-3 font-medium ${
                    activeTab === 'design'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  <Palette className="inline w-4 h-4 mr-2" />
                  Design
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 px-6 py-3 font-medium ${
                    activeTab === 'content'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  Innehåll
                </button>
                <button
                  onClick={() => setActiveTab('behavior')}
                  className={`flex-1 px-6 py-3 font-medium ${
                    activeTab === 'behavior'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  Beteende
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {activeTab === 'design' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primär färg
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="w-16 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bakgrundsfärg
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                          className="w-16 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Textfärg
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.textColor}
                          onChange={(e) => updateConfig('textColor', e.target.value)}
                          className="w-16 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.textColor}
                          onChange={(e) => updateConfig('textColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'content' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rubrik
                      </label>
                      <input
                        type="text"
                        value={config.headline}
                        onChange={(e) => updateConfig('headline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Beskrivning
                      </label>
                      <textarea
                        value={config.description}
                        onChange={(e) => updateConfig('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Knapptext
                      </label>
                      <input
                        type="text"
                        value={config.buttonText}
                        onChange={(e) => updateConfig('buttonText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={config.placeholder}
                        onChange={(e) => updateConfig('placeholder', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <hr className="my-4" />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Framgångsrubrik
                      </label>
                      <input
                        type="text"
                        value={config.successHeadline}
                        onChange={(e) => updateConfig('successHeadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Framgångsbeskrivning
                      </label>
                      <input
                        type="text"
                        value={config.successDescription}
                        onChange={(e) => updateConfig('successDescription', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rabattkod
                      </label>
                      <input
                        type="text"
                        value={config.discountCode}
                        onChange={(e) => updateConfig('discountCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'behavior' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visa efter (millisekunder)
                      </label>
                      <input
                        type="number"
                        value={config.showDelay}
                        onChange={(e) => updateConfig('showDelay', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        min="0"
                        step="1000"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {(config.showDelay / 1000).toFixed(1)} sekunder
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.showOnScroll}
                          onChange={(e) => updateConfig('showOnScroll', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Visa vid scroll
                        </span>
                      </label>
                    </div>

                    {config.showOnScroll && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Scroll procent (%)
                        </label>
                        <input
                          type="number"
                          value={config.scrollPercentage}
                          onChange={(e) => updateConfig('scrollPercentage', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          min="0"
                          max="100"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API URL
                      </label>
                      <input
                        type="text"
                        value={config.apiUrl}
                        onChange={(e) => updateConfig('apiUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base URL (Vercel URL)
                      </label>
                      <input
                        type="text"
                        value={config.baseUrl}
                        onChange={(e) => updateConfig('baseUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="https://bythjul-popup.vercel.app"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Uppdatera detta med din Vercel URL efter deploy
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Generate Script Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Genererad kod
              </h3>
              <button
                onClick={copyScript}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Kopierad!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Kopiera script
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Klistra in koden i {'<head>'} eller innan {'</body>'} på din site
              </p>
            </div>
          </div>

          {/* Right side - Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Förhandsgranskning
              </h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                {showPreview ? 'Göm popup' : 'Visa popup'}
              </button>
            </div>
            
            {showPreview && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setPreviewStep('form')}
                  className={`px-4 py-2 rounded-lg transition ${
                    previewStep === 'form'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Formulär
                </button>
                <button
                  onClick={() => setPreviewStep('success')}
                  className={`px-4 py-2 rounded-lg transition ${
                    previewStep === 'success'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Framgång
                </button>
              </div>
            )}
            
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-100 relative" style={{ height: '600px' }}>
              {showPreview && (
                <div 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: config.overlayColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <div 
                    style={{
                      background: config.backgroundColor,
                      borderRadius: '16px',
                      padding: '40px',
                      maxWidth: '480px',
                      width: '90%',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      position: 'relative'
                    }}
                  >
                    <button
                      onClick={() => setShowPreview(false)}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#999',
                        lineHeight: 1,
                        padding: '4px 8px'
                      }}
                    >
                      ×
                    </button>
                    
                    <h2 style={{ margin: '0 0 12px 0', color: config.textColor, fontSize: '28px', fontWeight: 'bold' }}>
                      {config.headline}
                    </h2>
                    <p style={{ margin: '0 0 24px 0', color: config.textColor, fontSize: '16px', opacity: 0.8 }}>
                      {config.description}
                    </p>
                    
                    {previewStep === 'form' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input 
                          type="email"
                          placeholder={config.placeholder}
                          style={{
                            padding: '14px 16px',
                            border: '2px solid #E5E5E5',
                            borderRadius: '8px',
                            fontSize: '16px',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                        />
                        <button
                          style={{
                            padding: '14px 24px',
                            background: config.primaryColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {config.buttonText}
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <h2 style={{ margin: '0 0 12px 0', color: config.textColor, fontSize: '28px', fontWeight: 'bold' }}>
                          {config.successHeadline}
                        </h2>
                        <p style={{ margin: '0 0 24px 0', color: config.textColor, fontSize: '16px', opacity: 0.8 }}>
                          {config.successDescription}
                        </p>
                        <div style={{
                          background: '#F7F7F7',
                          border: `2px dashed ${config.primaryColor}`,
                          borderRadius: '8px',
                          padding: '20px',
                          margin: '24px 0',
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: config.primaryColor,
                          letterSpacing: '2px'
                        }}>
                          {config.discountCode}
                        </div>
                        <button
                          style={{
                            padding: '14px 24px',
                            background: config.primaryColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {config.closeButtonText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {!showPreview && (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Klicka på "Visa popup" för att se förhandsgranskning
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}