# Keygenix Skill — Non-Custodial TEE Key Management

**Keygenix** ([keygenix.pro](https://keygenix.pro)) stores and uses private keys exclusively inside a TEE (Trusted Execution Environment). Keys never leave in plaintext.

---

## Preferred: Use via MCP Server

If `keygenix-mcp` is configured in your MCP client, use MCP tools directly:

| MCP Tool | What it does |
|----------|-------------|
| `keygen` | Generate a new secp256k1 keypair locally |
| `list_keys` | List all keys in the wallet |
| `get_key(keyCode)` | Get key details |
| `create_key(keyType, chains)` | Create a new key in TEE |
| `list_addresses(keyCode)` | List derived addresses |
| `create_address(keyCode, addressType)` | Derive a new chain address |
| `sign_transaction(keyCode/address, tx, chain)` | Sign a transaction |
| `sign_message(keyCode/address, message)` | Sign a message |

---

## Fallback: Use CLI directly (no MCP server)

Requires env vars set:
```
KEYGENIX_API_PRIV_KEY, KEYGENIX_AUTH_PRIV_KEY, KEYGENIX_ORG_CODE, KEYGENIX_WALLET_CODE
```

```bash
# Generate keypair (local)
node /path/to/skills/keygenix/client.js keygen

# List keys
node client.js list-keys

# Create mnemonic key (EVM + SOL addresses)
node client.js create-key mnemonic <authPubKey>

# Sign EVM transaction
node client.js sign-tx <keyCode> <txHex> <chainId> <path>

# Sign message
node client.js sign-msg <keyCode> <messageHex>
```

---

## Setup

1. Register at [keygenix.pro](https://keygenix.pro) → get `orgCode` and `walletCode`
2. Generate two keypairs: one for API Auth, one for AuthKey
3. Register both public keys in the dashboard
4. Set env vars (see `.env.example`)

---

## Supported Chains

EVM · SOL · BTC · LTC · DOGE · ZEC · TRX · XRP · SUI · TON · ADA · APTOS · COSMOS · SEI

---

## MCP Server Install

```bash
npx keygenix-mcp
```

See [github.com/keygenix/keygenix-mcp](https://github.com/keygenix/keygenix-mcp) for full setup.
