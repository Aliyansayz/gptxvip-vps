<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`



5- Optional (Tunneling InCase Of A Domain)
   
   Only these steps:
      server: {
      host: true, // allow access on all interfaces
      allowedHosts: ['physicsrun.com','.trycloudflare.com'], // allow Cloudflare tunnel domains
      port: 5173 // optional, default is 5173
         }
   npm run dev
   
   cloudflared tunnel --url http://localhost:5173 // for dev run

   npm run build
   
   npm run preview -- --host

   
   cloudflared tunnel --url http://localhost:4173 // for prod run
   



5- Optional (Tunneling InCase Of A Domain)

C:\Users\<YourUsername>\.cloudflared\config.yml

cloudflared tunnel login


      ```
      tunnel: vite-tunnel
      credentials-file: C:\Users\<YourUsername>\.cloudflared\<tunnel-id>.json

      ingress:
      - hostname: dev.mydomain.com
         service: http://localhost:5173
      - service: http_status:404
      ```

      ```
         service: http://localhost:4173
      ```

   npm run preview -- --host
   cloudflared tunnel run vite-tunnel # add port for prodution run/ dev run





---

### ✅ **Step 1: Log in to Cloudflare**

Run:

```bash
cloudflared tunnel login
```

This will open your browser and ask you to authorize with Cloudflare.
Select the domain you want to use (e.g., `mydomain.com`).

---

### ✅ **Step 2: Create a Named Tunnel**

Run:

```bash
cloudflared tunnel create vite-tunnel
```

This will create a tunnel called `vite-tunnel` and generate credentials.

---

### ✅ **Step 3: Configure the Tunnel**

Create a config file in:

```
C:\Users\<YourUsername>\.cloudflared\config.yml
```

with this content:

```yaml
tunnel: vite-tunnel
credentials-file: C:\Users\<YourUsername>\.cloudflared\<tunnel-id>.json

ingress:
  - hostname: dev.mydomain.com
    service: http://localhost:5173
  - service: http_status:404
```

Replace `dev.mydomain.com` with your subdomain and make sure `service` points to your local Vite server (`http://localhost:5173`).

---

### ✅ **Step 4: Add a DNS Record**

In your Cloudflare dashboard → **DNS** → add a **CNAME record**:

```
Name: dev
Target: <your tunnel ID>.cfargotunnel.com
Proxy status: Proxied (orange cloud)
```

---

### ✅ **Step 5: Run the Tunnel**

Start the tunnel with:

```bash
cloudflared tunnel run gptx-tunnel

cloudflared tunnel --config config_gptx.yml run

cloudflared tunnel --config "C:\Users\Aliyan\.cloudflared\config_gptx.yml" run


```

Now `https://dev.mydomain.com` should forward traffic to your Vite dev server.

