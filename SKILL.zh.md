# Keygenix Skill — 非托管 TEE 密钥管理

**Keygenix**（[keygenix.pro](https://keygenix.pro)）将私钥存储并使用于 TEE（可信执行环境）内部，私钥永远不以明文形式泄露。

---

## 通过 MCP Server 使用（推荐）

如果 `keygenix-mcp` 已在你的 MCP 客户端中配置，直接调用以下工具：

| 工具 | 功能 |
|------|------|
| `keygen` | 本地生成 secp256k1 密钥对（无网络请求） |
| `list_keys` | 列出钱包中的所有密钥 |
| `get_key(keyCode)` | 获取密钥详情 |
| `create_key(keyType, chains)` | 在 TEE 内创建新密钥 |
| `import_key(keyType, mnemonic/privateKey, chains)` | 将现有密钥导入 TEE（ECIES 加密传输） |
| `list_addresses(keyCode)` | 列出派生地址 |
| `create_address(keyCode, addressType)` | 派生新的链地址 |
| `sign_transaction(keyCode, tx, chain)` | 签名交易 |
| `sign_message(keyCode, message, chain)` | 签名消息 |

### MCP Server 安装

```bash
npm install github:wallet-io/keygenix-mcp
```

在 Claude Desktop / Cursor / Windsurf 中配置：
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
> 将 `/absolute/path/to/keygenix-mcp` 替换为实际安装路径。
> npm 发布后可改为：`"command": "npx", "args": ["keygenix-mcp"]`

---

## 不使用 MCP（CLI）

如果没有 MCP 客户端，使用本仓库内附的 CLI：

```bash
git clone https://github.com/wallet-io/keygenix-skill
cd keygenix-skill/cli
npm install
cp .env.example .env   # 填入你的密钥

node client.js keygen                           # 生成密钥对
node client.js list-keys                        # 列出密钥
node client.js create-key mnemonic <authPubKey>
node client.js sign-tx <keyCode> <txHex> <chainId>
node client.js sign-msg <keyCode> <messageHex>
```

---

## 支持的链

EVM · SOL · BTC · LTC · DOGE · ZEC · TRX · XRP · SUI · TON · ADA · APTOS · COSMOS · SEI

---

## 初始设置

1. 在 [keygenix.pro](https://keygenix.pro) 注册 → 获取 `orgCode` 和 `walletCode`
2. 生成两对密钥：API Auth Key + AuthKey（运行 `node client.js keygen` 两次）
3. 在 dashboard 中注册两个公钥
4. 设置环境变量
