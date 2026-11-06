# Optional lead-delivery backend (Version 23)

**Status: NOT DEPLOYED.** The site works without the backend by opening a composed email draft. A live lead submission route exists only after you set up hosting and mail delivery. Never claim automatic submission until verified end to end.

1. Deploy `worker.mjs` to a Cloudflare Worker, using `wrangler.toml.example` as a starting point, and configure the `LEAD_LIMIT_KV` namespace.
2. Configure four Wrangler secrets: `RESEND_API_KEY` (from Resend), `FROM_EMAIL` (verified sender domain), `TO_EMAIL` (`owners@justprotectllc.com`, verify recipient), and `ALLOWED_ORIGIN` (the exact HTTPS origin hosting the website, no trailing slash).
3. Publish the static site on HTTPS. Set `leadEndpoint` in `assets/site-config.js` to the worker `/lead` URL. Never put API keys or secrets in that JS file.
4. Send a genuine end-to-end test and verify mail is received before enabling the button for customers. Configure Cloudflare WAF or Turnstile for stronger abuse prevention. KV rate limiting is eventual-consistency and not an atomic production-grade abuse defense.
5. If delivery fails, the site preserves the manual email option. Neither the site nor the worker stores customer lead data in browser storage. The email provider processes the submitted lead.

The worker accepts POST JSON with name, email, phone, service, state, zip, property, details, consent:true and website:'' (honeypot). It validates fields, restricts origins, rate limits roughly 3 requests per IP/hour and sends plain-text email using the Resend API. The request is acknowledged as accepted only after the email service responds successfully; this does not prove inbox delivery.
