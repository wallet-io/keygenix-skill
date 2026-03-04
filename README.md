# keygenix-skill

**OpenClaw Skill + CLI for Keygenix** — Non-custodial TEE key management & signing.

[Keygenix](https://keygenix.pro) stores and uses private keys exclusively inside a **Trusted Execution Environment (TEE)**. Keys are never exposed in plaintext — not to you, not to the AI, not to Keygenix.

---

## What's in this repo

| Path | Description |
|------|-------------|
| `SKILL.md` | OpenClaw skill instructions (English) |
| `SKILL.zh.md` | OpenClaw skill instructions (Chinese) |
| `RELEASE.md` | Changelog |
| `cli/` | Standalone CLI for direct API access (no MCP client needed) |

---

## Quick Start

### Option A — MCP Server (recommended for AI agents)

The MCP Server wraps the full Keygenix API as AI-callable tools.

```bash
npm install github:wallet-io/keygenix-mcp
```

Configure in Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "keygenix": {
      "command": "node",
      "args": ["/absolute/path/to/node_modules/keygenix-mcp/dist/index.js"],
      "env": {
        "KEYGENIX_API_PRIV_KEY": "your-api-auth-private-key-hex",
        "KEYGENIX_AUTH_PRIV_KEY": "your-authkey-private-key-hex",
        "KEYGENIX_ORG_CODE": "your-org-code",
        "KEYGENIX_WALLET_CODE": "your-wallet-code"
      }
    }
  }
}
```

> Once published to npm: use `"command": "npx", "args": ["keygenix-mcp"]`

MCP Server repo: [wallet-io/keygenix-mcp](https://github.com/wallet-io/keygenix-mcp)

### Option B — CLI (scripting / debugging)

For direct API access without an AI client:

```bash
git clone https://github.com/wallet-io/keygenix-skill
cd keygenix-skill/cli
npm install
cp .env.example .env   # fill in your credentials
```

```bash
node client.js keygen                              # generate a secp256k1 keypair
node client.js list-keys                           # list keys in your wallet
node client.js create-key mnemonic                 # create an HD wallet key
node client.js import-key mnemonic "word1 word2…"  # import existing mnemonic
node client.js sign-tx <keyCode> <txHex> <chainId> # sign an EVM transaction
node client.js sign-msg <keyCode> <msgHex>         # sign a message
```

See [`cli/README.md`](./cli/README.md) for the full command reference.

---

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `keygen` | Generate a secp256k1 keypair locally (no network) |
| `list_keys` | List all keys in the wallet |
| `get_key` | Get key details by keyCode |
| `create_key` | Create a new key (mnemonic / private / secret) |
| `import_key` | Import existing key into TEE (ECIES encrypted locally) |
| `list_addresses` | List derived addresses for a key |
| `create_address` | Derive a new address for a specific chain |
| `sign_transaction` | Sign a blockchain transaction |
| `sign_message` | Sign an arbitrary message |

---

## Supported Chains

EVM · Solana · Bitcoin · Litecoin · Dogecoin · Zcash · Tron · Ripple · Sui · TON · Cardano · Aptos · Cosmos · Sei

---

## First-Time Setup

1. Register at [keygenix.pro](https://keygenix.pro) → create an org and wallet, note `orgCode` and `walletCode`
2. Generate two keypairs (run `node cli/client.js keygen` twice — one for API Auth, one for AuthKey)
3. Register both **public keys** in the Keygenix dashboard
4. Add private keys to your `.env` or MCP config

```
KEYGENIX_API_PRIV_KEY=<api-auth-private-key-hex>
KEYGENIX_AUTH_PRIV_KEY=<authkey-private-key-hex>
KEYGENIX_ORG_CODE=<your-org-code>
KEYGENIX_WALLET_CODE=<your-wallet-code>
```

---

## Security Model

```
AI Agent / CLI
  ↓  tool call (no keys in prompt)
keygenix-mcp / client.js (local process)
  ↓  ECDSA-signed HTTPS requests
Keygenix TEE API
  ↓  private key never leaves enclave
Signed transaction returned
```

- **API Auth Key** — signs every request. Stored in env, never hardcoded.
- **AuthKey** — authorizes sensitive ops (sign/export). Only the public key is registered with Keygenix; signing happens locally.
- **Wallet private keys** — generated and used inside TEE, never exposed.

---

## Links

- Website: [keygenix.pro](https://keygenix.pro)
- API Docs: [keygenix.pro/docs.html](https://keygenix.pro/docs.html)
- MCP Server: [wallet-io/keygenix-mcp](https://github.com/wallet-io/keygenix-mcp)
- Issues: [github.com/wallet-io/keygenix-skill/issues](https://github.com/wallet-io/keygenix-skill/issues)
