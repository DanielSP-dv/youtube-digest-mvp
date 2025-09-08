# **12. Unified Project Structure**

Our project will adopt a monorepo structure, leveraging `pnpm` workspaces, to house both the Next.js frontend and backend (API routes), along with shared utilities and configurations. This organization promotes code reuse and simplifies dependency management.

```plaintext
.
├── apps/
│   └── web/                    # Next.js application (frontend + API routes)
│       ├── public/
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/
│       │   │   ├── (dashboard)/
│       │   │   ├── (playlists)/
│       │   │   └── layout.tsx
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── styles/
│       │   ├── types/
│       │   └── utils/
│       ├── next.config.mjs
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── api/
│   │   ├── src/
│   │   │   ├── routers/
│   │   │   ├── services/
│   │   │   └── trpc.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── db/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   └── client.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── auth/
│   │   ├── src/
│   │   │   └── auth.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── utils/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── types/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── tooling/
│   ├── eslint/
│   ├── prettier/
│   └── typescript/
├── .env.example
├── .gitignore
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── package.json
├── README.md
└── tsconfig.json
```

---
