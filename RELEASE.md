# Keygenix Skill — Release v1.0.0

**Release Date:** 2026-03-04  
**Category:** Blockchain / Key Management / Web3 Infrastructure  
**Platforms:** OpenClaw, Claude, GPT, Gemini, and any MCP/ACP-compatible AI agent

---

## What Is This?

This skill enables AI agents to integrate with **Keygenix** — a non-custodial, TEE-backed private key management and signing service. With this skill, an AI agent can:

- **Manage crypto keys** (create, import, export) across 15+ blockchains
- **Sign transactions and messages** without ever touching a raw private key
- **Derive addresses** from HD wallet paths (BIP32, BIP44, ed25519-hd-key)

Private keys never leave Keygenix's Trusted Execution Environment. The agent constructs and submits signing requests; authorization is enforced by a client-held AuthKey that the agent signs locally — keeping the security model verifiable end-to-end.

---

## Key Features

| Feature | Detail |
|---------|--------|
| 🔐 Non-custodial signing | Agent signs txs without raw key access |
| 🌐 Multi-chain support | EVM, SOL, SUI, BTC, LTC, DOGE, TRX, XRP, TON, ADA, COSMOS, SEI, and more |
| 📦 HD wallet derivation | BIP32 / BIP44 / ed25519-hd-key path support |
| 🔒 ECIES import/export | Encrypted key migration — plaintext never on the wire |
| ⚡ Low-latency signing | Millisecond-level response, 99.9% uptime SLA |
| 🤖 AI-native design | Skill format optimized for LLM instruction following |

---

## Supported Operations

### Key Management
- `CreateKey` — Generate mnemonic / private key / secret inside TEE
- `ImportKey` — Encrypt key material locally → import into TEE (ECIES)
- `ListKeys` / `GetKey` — Catalog operations

### Address Management
- `CreateAddress` — Derive address from HD path (idempotent with `getOrCreate`)
- `ListAddresses` / `GetAddress` — Address catalog
- `GetPublicKey` — Retrieve derived public key for any path

### Signing
- `SignTransaction` — Sign EVM / SOL transactions (key-level with derivation)
- `SignMessage` — Sign arbitrary hex messages (key-level with derivation)
- `SignAddressTransaction` — Sign via specific address (no derivation needed)
- `SignAddressMessage` — Sign message via specific address

---

## Supported Chains

`EVM` · `SOL` · `SUI_SECP256K1` · `SUI_ED25519` · `BTC_P2PKH` · `BTC_P2WPKH` · `LTC_P2PKH` · `LTC_P2WPKH` · `ZEC_P2PKH` · `DOGE_P2PKH` · `TRX` · `XRP` · `APTOS` · `TON_V3R2` · `TON_V4R2` · `TON_V5R1` · `ADA_ENTERPRISE` · `COSMOS` · `SEI`

---

## Security Architecture

```
Client (AI Agent)                    Keygenix TEE
─────────────────                    ─────────────
API Auth Key  ──── authenticates ──► all /v1/api/* routes
AuthKey       ──── authorizes   ──► sign / export ops
                                     ↓
                              Private key stays here
                              Signs inside enclave
                              Returns signature only
```

**Threat model guarantees:**
- Keygenix cannot unilaterally sign — AuthKey is client-only
- API Auth Key cannot authorize signing — separate concern
- Import/export uses ECIES — plaintext key is never transmitted

---

## What's Included

| File | Purpose | Who needs it |
|------|---------|--------------|
| `SKILL.md` | English skill instructions for AI agents | All users |
| `SKILL.zh.md` | Chinese skill instructions for AI agents | Chinese users |
| `cli/client.js` | Node.js CLI for direct API calls | Developers / integration |
| `cli/secure_encryption.js` | ECIES encryption library | Developers / integration |
| `cli/.env.example` | Configuration template | All users |
| `cli/KEYS.md` | Key generation records | Per-deployment |

---

## Prerequisites

- Node.js ≥ 18
- Keygenix account (register at https://keygenix.pro)
- npm packages: `@noble/curves`, `@noble/hashes`, `json-stable-stringify`, `axios`

---

## Quick Setup

**Option A — MCP Server (recommended for AI agents):**
```bash
npm install github:wallet-io/keygenix-mcp
# Configure in your AI client — see keygenix-mcp README
```

**Option B — CLI (scripting / no AI client):**
```bash
cd keygenix-skill/cli
npm install
cp .env.example .env
# Fill in: KEYGENIX_API_PRIV_KEY, KEYGENIX_AUTH_PRIV_KEY, KEYGENIX_ORG_CODE, KEYGENIX_WALLET_CODE

node client.js keygen      # → generate API Auth Key
node client.js keygen      # → generate AuthKey
node client.js list-keys   # → test connection
```

---

## AI Agent Integration Pattern

This skill enables a clean separation of concerns for AI-driven blockchain automation:

```
AI Agent
  ├── Analyzes on-chain data / builds strategy
  ├── Constructs unsigned transaction (calldata, gas, nonce)
  ├── Calls Keygenix sign_transaction → gets signature
  └── Broadcasts signed tx to RPC node (Infura / Alchemy / QuickNode)
```

The agent never holds a private key. The human registers the AuthKey and controls signing authorization. Full automation with zero key exposure.

---

## Changelog

### v1.0.0 — 2026-03-04
- Initial release
- MCP Server: 9 tools (keygen, list_keys, get_key, create_key, import_key, list_addresses, create_address, sign_transaction, sign_message)
- CLI: 10 commands for direct API access without MCP
- ECIES encryption for key import (plaintext never on wire)
- English + Chinese skill documentation
- 19 address types across 15+ blockchains
