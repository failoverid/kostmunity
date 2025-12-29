# Deploy ke Vercel - Manual Upload

## Cara Paling Mudah (Drag & Drop)

1. **Buka** https://vercel.com/new
2. **Pilih** "Deploy without Git"
3. **Drag folder `dist/`** ke browser
4. **Project Name**: kostmunity
5. **Klik Deploy**
6. **Done!** ✨

Nanti dapat URL: https://kostmunity.vercel.app

## Custom Domain (Optional)

1. Buka project di Vercel dashboard
2. Settings → Domains
3. Tambah: `kostmnity.alfansyahprd.site`
4. Setup DNS A record di domain provider:
   - CNAME: kostmnity → cname.vercel-dns.com

## Update Deployment

Setiap ada perubahan:
```bash
npm run export
vercel --prod
```

Atau manual upload folder dist/ lagi.
