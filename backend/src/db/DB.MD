process.on("SIGINT", async () => { await disconnectDB(); process.exit(0) })
process.on("SIGTERM", async () => { await disconnectDB(); process.exit(0) })
```

- **SIGINT** — triggered when you press `Ctrl+C` in the terminal.
- **SIGTERM** — triggered by Docker, PM2, Kubernetes, or cloud platforms when shutting down a container.

Without these, the process would exit immediately, potentially mid-write, leaving connections in a dirty state on the MongoDB server. These ensure `disconnectDB()` always runs before exit.

---

## How Everything Connects Together
```
 .env file
    │
    ▼
 getMongoUri()
    │
    ▼
 mongo_Db_Connections()  ◄──── called once on app startup
    │
    ├── DNS fix already applied (module load time)
    │
    ├── isConnected? ──► YES → return (reuse pool)
    │         │
    │         NO
    │         ▼
    ├── mongoose.connect(uri, options)
    │         │
    │         ▼
    ├── Event listeners keep isConnected in sync
    │
    ▼
 App runs, handles requests (no new connections)
    │
    ▼
 SIGTERM / SIGINT
    │
    ▼
 disconnectDB() → mongoose.connection.close() → process.exit(0)

 