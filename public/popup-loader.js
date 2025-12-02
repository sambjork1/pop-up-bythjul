// Popup Loader - Loads configuration and creates popup
(function() {
  'use strict';
  
  // Get config ID from URL parameters
  const scriptTag = document.currentScript || document.querySelector('script[src*="popup-loader.js"]');
  const scriptSrc = scriptTag ? scriptTag.src : '';
  const params = new URLSearchParams(scriptSrc.split('?')[1]);
  
  const configId = params.get('id') || 'default';
  
  // Fetch configuration
  fetch(`${window.location.origin}/popup-configs/${configId}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Config not found');
      }
      return response.json();
    })
    .then(config => {
      initPopup(config);
    })
    .catch(error => {
      console.error('Failed to load popup configuration:', error);
    });
  
  function initPopup(config) {
    let hasShown = false;
    let hasSubscribed = localStorage.getItem('bythjul_subscribed') === 'true';
    
    if (hasSubscribed) return;
    
    const styles = `
      .bythjul-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${config.overlayColor};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .bythjul-popup-overlay.show {
        opacity: 1;
      }
      .bythjul-popup {
        background: ${config.backgroundColor};
        border-radius: 16px;
        padding: 40px;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
      }
      .bythjul-popup-overlay.show .bythjul-popup {
        transform: scale(1);
      }
      .bythjul-popup-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        line-height: 1;
        padding: 4px 8px;
      }
      .bythjul-popup-close:hover {
        color: #333;
      }
      .bythjul-popup h2 {
        margin: 0 0 12px 0;
        color: ${config.textColor};
        font-size: 28px;
        font-weight: bold;
      }
      .bythjul-popup p {
        margin: 0 0 24px 0;
        color: ${config.textColor};
        font-size: 16px;
        opacity: 0.8;
      }
      .bythjul-popup-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .bythjul-popup input {
        padding: 14px 16px;
        border: 2px solid #E5E5E5;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.2s;
        width: 100%;
        box-sizing: border-box;
      }
      .bythjul-popup input:focus {
        outline: none;
        border-color: ${config.primaryColor};
      }
      .bythjul-popup button {
        padding: 14px 24px;
        background: ${config.primaryColor};
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, opacity 0.2s;
      }
      .bythjul-popup button:hover {
        transform: translateY(-2px);
        opacity: 0.9;
      }
      .bythjul-popup button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      .bythjul-popup-error {
        color: #E53E3E;
        font-size: 14px;
        margin-top: 8px;
      }
      .bythjul-popup-success {
        text-align: center;
      }
      .bythjul-discount-code {
        background: #F7F7F7;
        border: 2px dashed ${config.primaryColor};
        border-radius: 8px;
        padding: 20px;
        margin: 24px 0;
        font-size: 32px;
        font-weight: bold;
        color: ${config.primaryColor};
        letter-spacing: 2px;
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    function createPopup() {
      const overlay = document.createElement('div');
      overlay.className = 'bythjul-popup-overlay';
      overlay.id = 'bythjul-popup-overlay';
      
      overlay.innerHTML = `
        <div class="bythjul-popup">
          <button class="bythjul-popup-close" onclick="document.getElementById('bythjul-popup-overlay').remove()">×</button>
          <div id="bythjul-popup-content">
            <h2>${config.headline}</h2>
            <p>${config.description}</p>
            <div class="bythjul-popup-form">
              <input 
                type="email" 
                placeholder="${config.placeholder}" 
                id="bythjul-email-input"
              />
              <button type="button" id="bythjul-submit-btn">${config.buttonText}</button>
              <div id="bythjul-error" class="bythjul-popup-error"></div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
      setTimeout(() => overlay.classList.add('show'), 10);
      
      const submitBtn = document.getElementById('bythjul-submit-btn');
      const emailInput = document.getElementById('bythjul-email-input');
      
      submitBtn.addEventListener('click', handleSubmit);
      emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleSubmit(e);
        }
      });
      
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.remove();
        }
      });
    }
    
    async function handleSubmit(e) {
      e.preventDefault();
      
      const emailInput = document.getElementById('bythjul-email-input');
      const submitBtn = document.getElementById('bythjul-submit-btn');
      const errorDiv = document.getElementById('bythjul-error');
      
      const email = emailInput.value.trim();
      
      if (!email) {
        errorDiv.textContent = 'Vänligen ange en e-postadress';
        return;
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        errorDiv.textContent = 'Vänligen ange en giltig e-postadress';
        return;
      }
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Skickar...';
      errorDiv.textContent = '';
      
      try {
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
          localStorage.setItem('bythjul_subscribed', 'true');
          showSuccess();
        } else {
          throw new Error(data.message || 'Något gick fel');
        }
      } catch (error) {
        errorDiv.textContent = error.message || 'Något gick fel. Försök igen.';
        submitBtn.disabled = false;
        submitBtn.textContent = config.buttonText;
      }
    }
    
    function showSuccess() {
      const content = document.getElementById('bythjul-popup-content');
      content.innerHTML = `
        <div class="bythjul-popup-success">
          <h2>${config.successHeadline}</h2>
          <p>${config.successDescription}</p>
          <div class="bythjul-discount-code">${config.discountCode}</div>
          <button onclick="document.getElementById('bythjul-popup-overlay').remove()">
            ${config.closeButtonText}
          </button>
        </div>
      `;
    }
    
    function showPopup() {
      if (hasShown) return;
      hasShown = true;
      createPopup();
    }
    
    if (config.showDelay > 0) {
      setTimeout(showPopup, config.showDelay);
    }
    
    if (config.showOnScroll) {
      window.addEventListener('scroll', function onScroll() {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercentage >= config.scrollPercentage) {
          showPopup();
          window.removeEventListener('scroll', onScroll);
        }
      });
    }
  }
})();