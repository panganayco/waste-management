// Configuration file for the Istorya Recipe Builder
const CONFIG = {
  // API endpoint (update this to your actual backend URL in production)
  API_BASE_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api',

  // Feature flags
  FEATURES: {
    SAVE_TO_SERVER: true,
    ANALYTICS: false,
    LOCAL_STORAGE: true
  },

  // Analytics configuration (if enabled)
  ANALYTICS: {
    GA_TRACKING_ID: '',
    MIXPANEL_TOKEN: ''
  },

  // Validation rules
  VALIDATION: {
    MAX_INGREDIENTS: 3,
    MIN_CONSTELLATION_POINTS: 0
  },

  // Local storage keys
  STORAGE_KEYS: {
    SESSION: 'istorya_session',
    DRAFT: 'istorya_draft'
  }
};

// Analytics helper functions
const Analytics = {
  trackEvent(category, action, label, value) {
    if (!CONFIG.FEATURES.ANALYTICS) return;

    // Google Analytics
    if (window.gtag && CONFIG.ANALYTICS.GA_TRACKING_ID) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }

    // Mixpanel
    if (window.mixpanel && CONFIG.ANALYTICS.MIXPANEL_TOKEN) {
      window.mixpanel.track(action, {
        category,
        label,
        value
      });
    }

    console.log('Analytics Event:', { category, action, label, value });
  },

  trackPageView(page) {
    if (!CONFIG.FEATURES.ANALYTICS) return;

    if (window.gtag && CONFIG.ANALYTICS.GA_TRACKING_ID) {
      window.gtag('config', CONFIG.ANALYTICS.GA_TRACKING_ID, {
        page_path: page
      });
    }
  },

  trackStepChange(stepNumber) {
    this.trackEvent('Navigation', 'step_change', `Step ${stepNumber}`, stepNumber);
  },

  trackSelection(type, value) {
    this.trackEvent('Selection', type, value);
  },

  trackRecipeSave(success) {
    this.trackEvent('Recipe', 'save', success ? 'success' : 'failure');
  }
};
