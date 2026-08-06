# Taste

- Wants the assistant to activate and use relevant skills (e.g., Convex auth) and follow official framework guides when wiring up integrations. Confidence: 0.4
- Prefers a lean stack — deliberately avoids Firebase, using pure Google Cloud OAuth clients instead of Firebase/Google Services config files. Confidence: 0.7
- Likes to verify auth/feature work hands-on via runnable demo flows (e.g., a protected route with a sign-in/sign-out round trip) rather than just reviewing code. Confidence: 0.6
- Prefers simple, plain UI (e.g., a standard RN `Button`) and keeping the existing working flow over adopting a library's fancier native components — explicitly reversed the native branded Google button in favor of the plain one. Confidence: 0.8
- Prefers the Google sign-in to always show the full account picker (all accounts on the device) at every login, rather than a low-friction path that only offers previously authorized accounts — flagged that only one account appeared after the first login as a regression. Confidence: 0.6
