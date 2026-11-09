# Appwrite lokal (untuk uji integrasi)

Appwrite 2.6.2 minimal (API + worker + PostgreSQL + Redis) agar fitur yang memakai Appwrite
(lead, portofolio, foto, harga, portal klien) bisa diuji tanpa akun Appwrite Cloud.
Tidak memasang Functions/Sites dan **tidak** memberi container akses ke socket Docker.

```sh
cd dev/appwrite
cp .env.example .env
# isi 3 nilai acak:
sed -i "s/^_APP_OPENSSL_KEY_V1=.*/_APP_OPENSSL_KEY_V1=$(openssl rand -hex 16)/; \
        s/^_APP_DB_PASS=.*/_APP_DB_PASS=$(openssl rand -hex 12)/; \
        s/^_APP_EXECUTOR_SECRET=.*/_APP_EXECUTOR_SECRET=$(openssl rand -hex 16)/" .env
docker compose --env-file .env up -d
curl http://127.0.0.1:9080/v1/health/version   # → {"version":"2.6.2"}
```

Buat akun konsol, project, dan API key lewat REST (ganti EMAIL/SANDI):

```sh
E=http://127.0.0.1:9080/v1; H='-H X-Appwrite-Project:console -H Content-Type:application/json'
curl -s $H -X POST $E/account -d '{"userId":"unique()","email":"EMAIL","password":"SANDI","name":"Admin"}'
curl -s -c jar $H -X POST $E/account/sessions/email -d '{"email":"EMAIL","password":"SANDI"}'
TEAM=$(curl -s -b jar $H -X POST $E/teams -d '{"teamId":"unique()","name":"Nandara"}' | jq -r '.["$id"]')
curl -s -b jar $H -X POST $E/projects -d "{\"projectId\":\"nandara\",\"name\":\"Nandara Build\",\"teamId\":\"$TEAM\",\"region\":\"default\"}"
curl -s -b jar $H -X POST $E/projects/nandara/keys -d '{"keyId":"unique()","name":"server","scopes":["databases.read","databases.write","tables.read","tables.write","columns.read","columns.write","indexes.read","indexes.write","rows.read","rows.write","buckets.read","buckets.write","files.read","files.write"]}' | jq -r .secret
```

Lalu dari root repo:

```sh
export APPWRITE_ENDPOINT=http://127.0.0.1:9080/v1 APPWRITE_PROJECT_ID=nandara APPWRITE_API_KEY=<secret>
npm run appwrite:setup
npm run build && ADMIN_PASSWORD=... npm start
```
