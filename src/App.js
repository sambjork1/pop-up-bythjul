import React, { useState } from 'react';
import { Copy, Check, Eye, Code, Palette } from 'lucide-react';

export default function PopupDesigner() {
  const [activeTab, setActiveTab] = useState('design');
  const [copied, setCopied] = useState(false);
  const [copiedConsole, setCopiedConsole] = useState(false);
  const [copiedConsoleLive, setCopiedConsoleLive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewStep, setPreviewStep] = useState('form');
  
  const [config, setConfig] = useState({
    primaryColor: '#FF6B6B',
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    headline: 'Få 10% rabatt!',
    description: 'Registrera din e-post och få en rabattkod direkt',
    buttonText: 'Få rabattkod',
    placeholder: 'Din e-postadress',
    successHeadline: 'Tack! 🎉',
    successDescription: 'Här är din rabattkod:',
    discountCode: 'BYTHJUL10',
    closeButtonText: 'Stäng',
    showDelay: 3000,
    showOnScroll: false,
    scrollPercentage: 50,
    apiUrl: 'https://www.bythjul.com/api/misc/newsletter',
    baseUrl: 'https://pop-up-bythjul.vercel.app'
  });

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateScript = () => {
    const configId = 'popup_' + Date.now();
    const cleanConfig = {...config};
    delete cleanConfig.baseUrl;
    
    return `<!-- Bythjul Popup Newsletter - Installation Script -->
<script>
(function() {
  'use strict';
  var script = document.createElement('script');
  script.src = '${config.baseUrl}/popup-loader.js?id=${configId}';
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
  ${JSON.stringify(cleanConfig, null, 2)}
-->`;
  };

  const generateConsoleScript = () => {
    const cfg = JSON.stringify(config).replace(/"/g, "'");
    return `(function(){const c=${cfg};if(document.getElementById('bythjul-test-popup')){document.getElementById('bythjul-test-popup').remove();}const s=document.createElement('style');s.textContent=\`.bythjul-popup-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:\${c.overlayColor};display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .3s ease}.bythjul-popup-overlay.show{opacity:1}.bythjul-popup{background:\${c.backgroundColor};border-radius:16px;padding:40px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3);position:relative;transform:scale(.9);transition:transform .3s ease}.bythjul-popup-overlay.show .bythjul-popup{transform:scale(1)}.bythjul-popup-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;color:#999;line-height:1;padding:4px 8px}.bythjul-popup-close:hover{color:#333}.bythjul-popup h2{margin:0 0 12px 0;color:\${c.textColor};font-size:28px;font-weight:bold}.bythjul-popup p{margin:0 0 24px 0;color:\${c.textColor};font-size:16px;opacity:.8}.bythjul-popup-form{display:flex;flex-direction:column;gap:12px}.bythjul-popup input{padding:14px 16px;border:2px solid #E5E5E5;border-radius:8px;font-size:16px;transition:border-color .2s;width:100%;box-sizing:border-box}.bythjul-popup input:focus{outline:none;border-color:\${c.primaryColor}}.bythjul-popup button{padding:14px 24px;background:\${c.primaryColor};color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:transform .2s,opacity .2s}.bythjul-popup button:hover{transform:translateY(-2px);opacity:.9}.bythjul-popup button:disabled{opacity:.6;cursor:not-allowed;transform:none}.bythjul-popup-error{color:#E53E3E;font-size:14px;margin-top:8px}.bythjul-popup-success{text-align:center}.bythjul-discount-code{background:#F7F7F7;border:2px dashed \${c.primaryColor};border-radius:8px;padding:20px;margin:24px 0;font-size:32px;font-weight:bold;color:\${c.primaryColor};letter-spacing:2px}\`;document.head.appendChild(s);const o=document.createElement('div');o.className='bythjul-popup-overlay';o.id='bythjul-test-popup';o.innerHTML=\`<div class="bythjul-popup"><button class="bythjul-popup-close" onclick="document.getElementById('bythjul-test-popup').remove()">×</button><div id="bythjul-popup-content"><h2>\${c.headline}</h2><p>\${c.description}</p><div class="bythjul-popup-form"><input type="email" placeholder="\${c.placeholder}" id="bythjul-email-input"/><button type="button" id="bythjul-submit-btn">\${c.buttonText}</button><div id="bythjul-error" class="bythjul-popup-error"></div></div></div></div>\`;document.body.appendChild(o);setTimeout(()=>o.classList.add('show'),10);const submitBtn=document.getElementById('bythjul-submit-btn');const emailInput=document.getElementById('bythjul-email-input');const errorDiv=document.getElementById('bythjul-error');async function mockApiCall(email){console.log('🧪 MOCK API - Detta är bara för test. E-post skickas INTE:',email);await new Promise(resolve=>setTimeout(resolve,800));return{ok:true,json:async()=>({status:'success',message:'Mock success'})}}submitBtn.addEventListener('click',async(e)=>{e.preventDefault();const email=emailInput.value.trim();if(!email){errorDiv.textContent='Vänligen ange en e-postadress';return}if(!email.includes('@')||!email.includes('.')){errorDiv.textContent='Vänligen ange en giltig e-postadress';return}submitBtn.disabled=true;submitBtn.textContent='Skickar...';errorDiv.textContent='';try{const response=await mockApiCall(email);const data=await response.json();if(response.ok&&data.status==='success'){console.log('✅ Mock success - popup showing discount code');document.getElementById('bythjul-popup-content').innerHTML=\`<div class="bythjul-popup-success"><h2>\${c.successHeadline}</h2><p>\${c.successDescription}</p><div class="bythjul-discount-code">\${c.discountCode}</div><button onclick="document.getElementById('bythjul-test-popup').remove()">\${c.closeButtonText}</button></div>\`}else{throw new Error(data.message||'Något gick fel')}}catch(error){errorDiv.textContent=error.message||'Något gick fel. Försök igen.';submitBtn.disabled=false;submitBtn.textContent=c.buttonText}});emailInput.addEventListener('keypress',(e)=>{if(e.key==='Enter'){submitBtn.click()}});o.addEventListener('click',(e)=>{if(e.target===o){o.remove()}});console.log('🎨 Bythjul popup TEST-läge (Mock API) - E-post skickas INTE till servern')})();`;
  };

  const generateConsoleLiveScript = () => {
    const cfg = JSON.stringify(config).replace(/"/g, "'");
    return `(function(){const c=${cfg};if(document.getElementById('bythjul-test-popup')){document.getElementById('bythjul-test-popup').remove();}const s=document.createElement('style');s.textContent=\`.bythjul-popup-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:\${c.overlayColor};display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .3s ease}.bythjul-popup-overlay.show{opacity:1}.bythjul-popup{background:\${c.backgroundColor};border-radius:16px;padding:40px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3);position:relative;transform:scale(.9);transition:transform .3s ease}.bythjul-popup-overlay.show .bythjul-popup{transform:scale(1)}.bythjul-popup-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;color:#999;line-height:1;padding:4px 8px}.bythjul-popup-close:hover{color:#333}.bythjul-popup h2{margin:0 0 12px 0;color:\${c.textColor};font-size:28px;font-weight:bold}.bythjul-popup p{margin:0 0 24px 0;color:\${c.textColor};font-size:16px;opacity:.8}.bythjul-popup-form{display:flex;flex-direction:column;gap:12px}.bythjul-popup input{padding:14px 16px;border:2px solid #E5E5E5;border-radius:8px;font-size:16px;transition:border-color .2s;width:100%;box-sizing:border-box}.bythjul-popup input:focus{outline:none;border-color:\${c.primaryColor}}.bythjul-popup button{padding:14px 24px;background:\${c.primaryColor};color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:transform .2s,opacity .2s}.bythjul-popup button:hover{transform:translateY(-2px);opacity:.9}.bythjul-popup button:disabled{opacity:.6;cursor:not-allowed;transform:none}.bythjul-popup-error{color:#E53E3E;font-size:14px;margin-top:8px}.bythjul-popup-success{text-align:center}.bythjul-discount-code{background:#F7F7F7;border:2px dashed \${c.primaryColor};border-radius:8px;padding:20px;margin:24px 0;font-size:32px;font-weight:bold;color:\${c.primaryColor};letter-spacing:2px}\`;document.head.appendChild(s);const o=document.createElement('div');o.className='bythjul-popup-overlay';o.id='bythjul-test-popup';o.innerHTML=\`<div class="bythjul-popup"><button class="bythjul-popup-close" onclick="document.getElementById('bythjul-test-popup').remove()">×</button><div id="bythjul-popup-content"><h2>\${c.headline}</h2><p>\${c.description}</p><div class="bythjul-popup-form"><input type="email" placeholder="\${c.placeholder}" id="bythjul-email-input"/><button type="button" id="bythjul-submit-btn">\${c.buttonText}</button><div id="bythjul-error" class="bythjul-popup-error"></div></div></div></div>\`;document.body.appendChild(o);setTimeout(()=>o.classList.add('show'),10);const submitBtn=document.getElementById('bythjul-submit-btn');const emailInput=document.getElementById('bythjul-email-input');const errorDiv=document.getElementById('bythjul-error');submitBtn.addEventListener('click',async(e)=>{e.preventDefault();const email=emailInput.value.trim();if(!email){errorDiv.textContent='Vänligen ange en e-postadress';return}if(!email.includes('@')||!email.includes('.')){errorDiv.textContent='Vänligen ange en giltig e-postadress';return}submitBtn.disabled=true;submitBtn.textContent='Skickar...';errorDiv.textContent='';try{console.log('🌐 LIVE API - Skickar till: '+c.apiUrl);const response=await fetch(c.apiUrl,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','X-Requested-With':'XMLHttpRequest'},body:JSON.stringify({email})});const contentType=response.headers.get('content-type');console.log('📋 Response Content-Type:',contentType);console.log('📊 Response Status:',response.status);if(contentType&&contentType.includes('application/json')){const data=await response.json();console.log('📦 Response Data:',data);if(response.ok&&data.status==='success'){console.log('✅ API Success:',data);localStorage.setItem('bythjul_subscribed','true');document.getElementById('bythjul-popup-content').innerHTML=\`<div class="bythjul-popup-success"><h2>\${c.successHeadline}</h2><p>\${c.successDescription}</p><div class="bythjul-discount-code">\${c.discountCode}</div><button onclick="document.getElementById('bythjul-test-popup').remove()">\${c.closeButtonText}</button></div>\`}else{throw new Error(data.message||'Något gick fel')}}else{const text=await response.text();console.error('❌ Server returnerade HTML istället för JSON:');console.log(text.substring(0,500));throw new Error('Servern svarade med HTML. Kontrollera API-endpoint.')}}catch(error){console.error('❌ API Error:',error);errorDiv.textContent=error.message||'Något gick fel. Försök igen.';submitBtn.disabled=false;submitBtn.textContent=c.buttonText}});emailInput.addEventListener('keypress',(e)=>{if(e.key==='Enter'){submitBtn.click()}});o.addEventListener('click',(e)=>{if(e.target===o){o.remove()}});console.log('🚀 Bythjul popup LIVE-läge - E-post skickas till API: '+c.apiUrl)})();`;
  };

  const copyScript = () => {
    navigator.clipboard.writeText(generateScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyConsoleScript = () => {
    navigator.clipboard.writeText(generateConsoleScript());
    setCopiedConsole(true);
    setTimeout(() => setCopiedConsole(false), 2000);
  };

  const copyConsoleLiveScript = () => {
    navigator.clipboard.writeText(generateConsoleLiveScript());
    setCopiedConsoleLive(true);
    setTimeout(() => setCopiedConsoleLive(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Popup Designer</h1>
          <p className="text-gray-600">Designa din newsletter popup och generera kod</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        placeholder="https://pop-up-bythjul.vercel.app"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Din Vercel deployment URL
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Genererad kod
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>🎨 Test-läge (Mock API):</strong> Visa design utan att skicka data
                  </p>
                  <button
                    onClick={copyConsoleScript}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center"
                  >
                    {copiedConsole ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Kopierad!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mr-2" />
                        Kopiera test-script (Mock)
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>🚀 Live-läge (Riktigt API):</strong> Registrerar e-post på riktigt
                  </p>
                  <button
                    onClick={copyConsoleLiveScript}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition flex items-center justify-center"
                  >
                    {copiedConsoleLive ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Kopierad!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mr-2" />
                        Kopiera live-script (API)
                      </>
                    )}
                  </button>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>📦 Installation:</strong> Lägg på webbplatsen permanent
                  </p>
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
                        Kopiera installations-script
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                    
                    {previewStep === 'form' ? (
                      <>
                        <h2 style={{ margin: '0 0 12px 0', color: config.textColor, fontSize: '28px', fontWeight: 'bold' }}>
                          {config.headline}
                        </h2>
                        <p style={{ margin: '0 0 24px 0', color: config.textColor, fontSize: '16px', opacity: 0.8 }}>
                          {config.description}
                        </p>
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
                      </>
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