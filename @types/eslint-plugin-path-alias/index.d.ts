import { Linter } from 'eslint';

interface PathAliasNoRelativeConfig {
  configFilePath?: string;
  ignoredPaths?: string[];
  paths?: Record<string, string>;
}

interface PathAliasNoRelativeRule {
  (config: [PathAliasNoRelativeConfig]): 'error' | 'warn' | 'off';
}

declare const name: string;
declare const version: string;
declare const meta: {
  name: string;
  version: string;
};
declare const rules: {
  'no-relative': PathAliasNoRelativeRule;
};

declare const eslintPluginPathAlias: {
  name: string;
  version: string;
  meta: {
    name: string;
    version: string;
  };
  rules: {
    'no-relative': PathAliasNoRelativeRule;
  };
};

export {
  PathAliasNoRelativeConfig,
  PathAliasNoRelativeRule,
  eslintPluginPathAlias,
  meta,
  name,
  rules,
  version,
};
