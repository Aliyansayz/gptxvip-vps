
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
   ```

   To expose your development server to the internet using a temporary Cloudflare tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```

3. **Production Build and Preview:**
   First, build the production-ready application:
   ```bash
   npm run build
   ```

   Next, preview the production build locally (exposing it to your local network):
   ```bash
   npm run preview -- --host
   ```

   To expose your production preview (which runs on port 4173) to the internet:
   ```bash
   cloudflared tunnel --url http://localhost:4173
   ```

---

## Cloudflare Linux Setup (From Scratch)

If you need to set up Cloudflare `cloudflared` from scratch on a new Linux server, follow these steps:

1. **Install `cloudflared`**
   ```bash
   wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```

2. **Authenticate**
   ```bash
   cloudflared tunnel login
   ```

3. **Create a Tunnel**
   ```bash
   cloudflared tunnel create your-tunnel-name
   ```

4. **Configure the Tunnel**
   Create or edit `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: <Tunnel-UUID>
   credentials-file: /root/.cloudflared/<Tunnel-UUID>.json

   ingress:
     - hostname: yourdomain.com
       service: http://localhost:4173
     - service: http_status:404
   ```

5. **Route DNS**
   ```bash
   cloudflared tunnel route dns your-tunnel-name yourdomain.com
   ```

6. **Start the Tunnel**
   ```bash
   cloudflared tunnel run your-tunnel-name
   ```



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

