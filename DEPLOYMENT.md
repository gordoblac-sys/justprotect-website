# Just Protect LLC — GitHub + Render launch

This is the V100 static website prepared for deployment. All seven HTML pages and original assets are retained. `backend/` is documentation and optional code only; it is **not** deployed by this Render static-site configuration.

## Step 1: GitHub
Create a **private** repository named `justprotect-website` under `gordoblac-sys`. Do not initialize with README or .gitignore. Upload/push the contents of this folder to its `main` branch.

From this directory, if GitHub CLI authentication is configured:

```bash
git init
git add .
git commit -m "Launch baseline: Just Protect V100"
git branch -M main
git remote add origin https://github.com/gordoblac-sys/justprotect-website.git
git push -u origin main
```

## Step 2: Render
In Render, select **New > Blueprint** and connect the GitHub repository. Render reads `render.yaml` to create the static site. Alternatively create a Static Site with build command `echo ready` and publish directory `.`. Verify seven page routes and assets. Keep the Render URL private until checks pass.

## Step 3: Domain
Once the Render site is verified, add `justprotectllc.com` in Render custom domains and apply the DNS records Render actually provides at your DNS host. Do not guess or replace current DNS until the cutover plan is approved.

## Important
Contact actions are manual email drafts. No form backend, automated email, CRM integration, or live lead delivery is enabled. Confirm territory and service claims before public launch. Future releases should be committed via reviewed changes to main, triggering Render deployments.
