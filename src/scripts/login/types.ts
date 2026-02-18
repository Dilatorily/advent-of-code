export interface BitwardenAuthenticatedStatusResponse {
  lastSync: string;
  serverUrl: string;
  status: 'locked' | 'unlocked';
  userEmail: string;
  userId: string;
}

export interface BitwardenConfiguration {
  clientId: string;
  clientSecret: string;
  serverUrl: string;
}

export interface BitwardenItem {
  id: string;
  login: {
    password: null | string;
    totp: null | string;
    username: null | string;
  };
}

export type BitwardenStatusResponse =
  | BitwardenAuthenticatedStatusResponse
  | BitwardenUnauthenticatedStatusResponse;

export interface BitwardenUnauthenticatedStatusResponse {
  lastSync: null;
  serverUrl: string;
  status: 'unauthenticated';
  userEmail: null;
  userId: null;
}
