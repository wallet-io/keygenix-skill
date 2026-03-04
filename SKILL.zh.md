# Keygenix Skill — 非托管 TEE 密钥管理

**Keygenix**（[keygenix.pro](https://keygenix.pro)）将私钥存储并使用于 TEE（可信执行环境）内部，私钥永远不以明文形式泄露。

---

## 推荐：通过 MCP Server 使用

如果 `keygenix-mcp` 已在你的 MCP 客户端中配置，直接调用 MCP 工具：

| MCP 工具 | 功能 |
|---------|------|
| `keygen` | 本地生成 secp256k1 密钥对 |
| `list_keys` | 列出钱包中的所有密钥 |
| `get_key(keyCode)` | 获取密钥详情 |
| `create_key(keyType, chains)` | 在 TEE 内创建新密钥 |
| `list_addresses(keyCode)` | 列出派生地址 |
| `create_address(keyCode, addressType)` | 派生新的链地址 |
| `sign_transaction(keyCode/address, tx, chain)` | 签名交易 |
| `sign_message(keyCode/address, message)` | 签名消息 |

---

## 备用：直接使用 CLI（无 MCP Server）

需要设置环境变量：
```
KEYGENIX_API_PRIV_KEY, KEYGENIX_AUTH_PRIV_KEY, KEYGENIX_ORG_CODE, KEYGENIX_WALLET_CODE
```

```bash
# 生成密钥对（本地）
node client.js keygen

# 列出密钥
node client.js list-keys

# 创建助记词密钥（EVM + SOL 地址）
node client.js create-key mnemonic <authPubKey>

# 签名 EVM 交易
node client.js sign-tx <keyCode> <txHex> <chainId> <path>

# 签名消息
node client.js sign-msg <keyCode> <messageHex>
```

---

## 初始设置

1. 在 [keygenix.pro](https://keygenix.pro) 注册 → 获取 `orgCode` 和 `walletCode`
2. 生成两对密钥：一对用于 API Auth，一对用于 AuthKey
3. 在 dashboard 中注册两个公钥
4. 设置环境变量（参考 `.env.example`）

---

## 支持的链

EVM · SOL · BTC · LTC · DOGE · ZEC · TRX · XRP · SUI · TON · ADA · APTOS · COSMOS · SEI

---

## MCP Server 安装

```bash
npx keygenix-mcp
```

完整配置请参考：[github.com/keygenix/keygenix-mcp](https://github.com/keygenix/keygenix-mcp)
