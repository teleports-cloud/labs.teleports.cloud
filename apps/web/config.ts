/**
 * Application configuration
 * Centralized configuration for all URLs and endpoints
 */

const config = {
  // API Base URL
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.labs.teleports.cloud",

    // API Endpoints
    endpoints: {
      session: {
        create: "/api/session/create",
        files: (sessionId: string) => `/api/session/${sessionId}/files`,
      },
      upload: "/api/upload",
      health: "/health",
    }
  },

  // Frontend URLs
  frontend: {
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "https://labs.teleports.cloud",
  },

  // TUI (Textual User Interface) URL
  tui: {
    url: process.env.NEXT_PUBLIC_TUI_URL || "https://labs-teleports-cloud.onrender.com",
  },

  // Feature flags
  features: {
    realTimeSync: true,
    syncIntervalMs: 2000, // 2 seconds
    uploadMaxSizeMB: 50,
    inactivityWarningMinutes: 28,
    sessionTimeoutMinutes: 30,
  }
} as const;

export default config;

// Helper functions for building full URLs
export const getApiUrl = (endpoint: string) => {
  return `${config.api.baseUrl}${endpoint}`;
};

export const getSessionFilesUrl = (sessionId: string) => {
  return getApiUrl(config.api.endpoints.session.files(sessionId));
};

export const getUploadUrl = () => {
  return getApiUrl(config.api.endpoints.upload);
};

export const getCreateSessionUrl = () => {
  return getApiUrl(config.api.endpoints.session.create);
};

export const getTuiUrl = () => {
  return config.tui.url;
};
