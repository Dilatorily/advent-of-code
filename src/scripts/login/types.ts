export interface BitwardenConfiguration {
  clientId: string;
  clientSecret: string;
  serverUrl: string;
}

export interface BitwardenUnauthenticatedStatusResponse {
  lastSync: null;
  serverUrl: string;
  status: 'unauthenticated';
  userEmail: null;
  userId: null;
}

export interface BitwardenAuthenticatedStatusResponse {
  lastSync: string;
  serverUrl: string;
  status: 'locked' | 'unlocked';
  userEmail: string;
  userId: string;
}

export type BitwardenStatusResponse =
  | BitwardenUnauthenticatedStatusResponse
  | BitwardenAuthenticatedStatusResponse;

export interface BitwardenItem {
  id: string;
  login: {
    password: string | null;
    totp: string | null;
    username: string | null;
  };
}
