# Keygenix Skill — Non-Custodial TEE Key Management

**Keygenix** ([keygenix.pro](https://keygenix.pro)) stores and uses private keys exclusively inside a TEE (Trusted Execution Environment). Keys never leave in plaintext.

---

## Using via MCP Server (recommended)

If `keygenix-mcp` is configured in your MCP client, use these tools directly:

| Tool | Description |
|------|-------------|
| `keygen` | Generate a new secp256k1 keypair locally (no network) |
| `list_keys` | List all keys in the wallet |
| `get_key(keyCode)` | Get key details |
| `create_key(keyType, chains)` | Create a new key in TEE |
| `import_key(keyType, mnemonic/privateKey, chains)` | Import existing key into TEE (ECIES encrypted) |
| `list_addresses(keyCode)` | List derived addresses |
| `create_address(keyCode, addressType)` | Derive a new chain address |
| `sign_transaction(keyCode, tx, chain)` | Sign a transaction |
| `sign_message(keyCode, message, chain)` | Sign a message |

### MCP Server setup

```bash
npm install github:onezerotrace/keygenix-mcp
```

Configure in Claude Desktop / Cursor / Windsurf:
```json
{
  "mcpServers": {
    "keygenix": {
      "command": "node",
      "args": ["/absolute/path/to/keygenix-mcp/dist/index.js"],
      "env": {
        "KEYGENIX_API_PRIV_KEY": "...",
        "KEYGENIX_AUTH_PRIV_KEY": "...",
        "KEYGENIX_ORG_CODE": "...",
        "KEYGENIX_WALLET_CODE": "..."
      }
    }
  }
}
```
> Replace `/absolute/path/to/keygenix-mcp` with the actual path where you installed it.
> Once published to npm: use `"command": "npx", "args": ["keygenix-mcp"]` instead.

---

## Without MCP (CLI)

For scripting or debugging without an MCP client, use the CLI included in this repo:

```bash
git clone https://github.com/onezerotrace/keygenix-skill
cd keygenix-skill/cli
npm install
cp .env.example .env   # fill in your keys

node client.js keygen                          # generate keypair
node client.js list-keys                       # list keys
node client.js create-key mnemonic <authPubKey>
node client.js sign-tx <keyCode> <txHex> <chainId>
node client.js sign-msg <keyCode> <messageHex>
```

---

## Supported Chains

EVM · SOL · BTC · LTC · DOGE · ZEC · TRX · XRP · SUI · TON · ADA · APTOS · COSMOS · SEI

---

## Setup

1. Register at [keygenix.pro](https://keygenix.pro) → get `orgCode` and `walletCode`
2. Generate two keypairs: API Auth Key + AuthKey (`node client.js keygen` twice)
3. Register both public keys in the dashboard
4. Set env vars
