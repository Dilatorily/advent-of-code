export interface SetupResponse {
  serverUrl?: string;
  clientId: string;
  clientSecret: string;
}

export interface GitHubCredentials {
  username: string;
  password: string;
  totp?: string;
  itemId: string;
}

export interface BwCommandOptions {
  env?: Record<string, string | undefined>;
}
