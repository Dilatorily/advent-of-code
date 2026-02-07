declare module 'eslint-plugin-path-alias' {
  import type { Rule } from 'eslint';

  interface PathAliasRules {
    'no-relative': Rule.RuleModule & {
      meta: Rule.RuleMetaData;
    };
  }

  const plugin: {
    rules: PathAliasRules;
  };

  export default plugin;
}
