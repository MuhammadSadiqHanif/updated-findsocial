import auth0 from 'auth0-js';
export const webAuth = new auth0.WebAuth({
  domain: `dev-findsocial.eu.auth0.com`,
  clientID: `Pj6gLmnOSJCN6sziQG0ByRbQU0Ou88cK`,
  scope:
    'read:current_user read:users_app_metadata update:users_app_metadata   update:current_user_metadata',
});
export const authentication = new auth0.Authentication({
  domain: `dev-findsocial.eu.auth0.com`,
  clientID: `Pj6gLmnOSJCN6sziQG0ByRbQU0Ou88cK`,
});
