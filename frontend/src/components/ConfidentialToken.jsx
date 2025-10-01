import { useState, useEffect } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount, useWalletClient } from 'wagmi'
import { useEthersSigner } from '../hooks/useEthersSigner'
import { getContractAddress } from '../config/contracts'
import ConfidentialUSDTABI from '../config/ConfidentialUSDTABI'
import { Contract } from 'ethers'
import { useI18n } from '../contexts/I18nContext'

const ConfidentialToken = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const signer = useEthersSigner({ chainId })
  const { t } = useI18n()

  const [encBalanceHandle, setEncBalanceHandle] = useState('')
  const [decBalance, setDecBalance] = useState(null)
  const [decBalanceHuman, setDecBalanceHuman] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState(6)
  const [tokenAddress, setTokenAddress] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [transferAmt, setTransferAmt] = useState('')
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)

  const CONTRACT_ADDRESS = tokenAddress || getContractAddress('ConfidentialUSDT', chainId)

  const ensureReady = () => {
    if (!address) { alert(t('common.connect_wallet')); return false }
    if (!isInitialized || !instance) { alert(t('common.init_sdk_first')); return false }
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') { alert(t('ctoken.addr_not_set')); return false }
    return true
  }

  const handleFaucet = async () => {
    if (!ensureReady()) return
    setLoading(true)
    try {
      const s = await signer
      const contract = new Contract(CONTRACT_ADDRESS, ConfidentialUSDTABI, s)
      const tx = await contract.faucet()
      await tx.wait()
      setTxHash(tx.hash)
      alert(t('ctoken.faucet_ok'))
    } catch (e) {
      console.error(e)
      alert(t('ctoken.tx_failed') + ' ' + (e?.message || e))
    } finally { setLoading(false) }
  }

  const fetchEncryptedBalance = async (userAddr) => {
    const s = await signer
    const contract = new Contract(CONTRACT_ADDRESS, ConfidentialUSDTABI, s)
    return await contract.confidentialBalanceOf(userAddr)
  }

  const handleFetchEncryptedBalance = async () => {
    if (!ensureReady()) return
    setLoading(true)
    try {
      const encBal = await fetchEncryptedBalance(address)
      const handle = encBal?.toString?.() || String(encBal)
      setEncBalanceHandle(handle)
    } catch (e) {
      console.error(e)
      alert(t('ctoken.fetch_enc_failed') + ' ' + (e?.message || e))
    } finally { setLoading(false) }
  }

  const handleDecryptBalance = async () => {
    if (!ensureReady()) return
    if (!walletClient) { alert(t('common.connect_wallet')); return }
    if (!encBalanceHandle) { alert(t('ctoken.no_enc_balance')); return }
    setLoading(true)
    try {
      const handle = encBalanceHandle
      const keypair = instance.generateKeypair()
      const handleContractPairs = [{ handle, contractAddress: CONTRACT_ADDRESS }]
      const startTimeStamp = Math.floor(Date.now() / 1000).toString()
      const durationDays = '10'
      const contractAddresses = [CONTRACT_ADDRESS]
      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays)

      const signature = await walletClient.signTypedData({
        domain: eip712.domain,
        types: { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        primaryType: 'UserDecryptRequestVerification',
        message: eip712.message,
      })

      const res = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x',''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays,
      )
      const dec = res[handle]
      const decStr = (dec !== undefined && dec !== null) ? dec.toString() : ''
      setDecBalance(decStr)
      if (decStr) {
        const bi = BigInt(decStr)
        const human = (Number(bi) / Math.pow(10, tokenDecimals)).toString()
        setDecBalanceHuman(human)
      } else {
        setDecBalanceHuman('')
      }
    } catch (e) {
      console.error(e)
      alert(t('ctoken.decrypt_failed') + ' ' + (e?.message || e))
    } finally { setLoading(false) }
  }

  const humanToAtomic = (valueStr, decimals) => {
    const [intPart, fracRaw=''] = String(valueStr).trim().split('.')
    const frac = (fracRaw + '0'.repeat(decimals)).slice(0, decimals)
    const joined = (intPart || '0') + frac
    return BigInt(joined)
  }

  const handleTransfer = async () => {
    if (!ensureReady()) return
    if (!transferTo || !transferAmt) { alert(t('ctoken.need_to_and_amount')); return }
    setLoading(true)
    try {
      const atomic = humanToAtomic(transferAmt, tokenDecimals)
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address)
      input.add64(Number(atomic.toString()))
      const encryptedInput = await input.encrypt()

      const s = await signer
      const contract = new Contract(CONTRACT_ADDRESS, ConfidentialUSDTABI, s)

      let tx
      // try transferEncrypted first, else fallback to transfer
      tx = await contract.confidentialTransfer(transferTo, encryptedInput.handles[0], encryptedInput.inputProof)
      await tx.wait()
      setTxHash(tx.hash)
      alert(t('ctoken.transfer_ok'))
    } catch (e) {
      console.error(e)
      alert(t('ctoken.tx_failed') + ' ' + (e?.message || e))
    } finally { setLoading(false) }
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>{t('ctoken.section_title')}</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ {t('common.init_sdk_first')}</p>
          <p style={{ fontSize: '14px', color: '#666' }}>{t('ctoken.sdk_required')}</p>
        </div>
      </div>
    )
  }

  // Load decimals once after ready
  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!isInitialized || !address || !CONTRACT_ADDRESS) return
      try {
        const s = await signer
        const c = new Contract(CONTRACT_ADDRESS, ConfidentialUSDTABI, s)
        const d = await c.decimals()
        const n = typeof d === 'number' ? d : (d?.toNumber ? d.toNumber() : 6)
        if (mounted) setTokenDecimals(n)
      } catch {
        // keep default 6 if call fails
      }
    })()
    return () => { mounted = false }
  }, [isInitialized, address, CONTRACT_ADDRESS, signer])

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>{t('ctoken.section_title')}</h3>

      <div style={{ marginBottom: '16px', background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>{t('ctoken.intro_1')}</p>
        <p style={{ margin: 0 }}>{t('ctoken.intro_2')}</p>
      </div>

      {/* Contract code example */}
      <div style={{ marginBottom: '16px' }}>
        <h5>📝 {t('ctoken.contract_code')}</h5>
        <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
          <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// contracts/ConfidentialUSDT.sol
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {ConfidentialFungibleToken} from "new-confidential-contracts/token/ConfidentialFungibleToken.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialUSDT is ConfidentialFungibleToken, SepoliaConfig {
    constructor() ConfidentialFungibleToken("cUSDT", "cUSDT", "") {}

    // Simple faucet for demo: mints 100 cUSDT (assuming 6 decimals → 100 * 1_000_000)
    function faucet() external {
        _mint(msg.sender, FHE.asEuint64(100 * 1_000_000));
    }

    // Inherited from ConfidentialFungibleToken:
    // function confidentialBalanceOf(address account) external view returns (euint64);
    // function confidentialTransfer(address to, externalEuint64 encryptedAmount, bytes calldata inputProof)
    //     external returns (euint64);
    // function decimals() external view returns (uint8);
}
`}</pre>
        </div>
      </div>

      {/* <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: 'bold' }}>{t('ctoken.contract_addr')}</label>
        <input
          type="text"
          placeholder={CONTRACT_ADDRESS}
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '6px', border: '1px solid #ccc', borderRadius: '6px', fontFamily: 'monospace' }}
        />
        <p style={{ fontSize: '12px', color: '#666' }}>{t('ctoken.addr_hint')}</p>
      </div> */}

      <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr', marginBottom: '12px' }}>
        <button onClick={handleFaucet} disabled={loading} style={{ padding: '10px 16px', background: '#2196F3', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>{t('ctoken.call_faucet')}</button>
        <button onClick={handleFetchEncryptedBalance} disabled={loading} style={{ padding: '10px 16px', background: '#607D8B', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>{t('ctoken.fetch_enc_balance')}</button>
      </div>

      {encBalanceHandle && (
        <div style={{ marginBottom: '16px', background: '#f0f8ff', padding: '12px', borderRadius: '8px' }}>
          <div><strong>{t('ctoken.enc_balance_handle')}:</strong></div>
          <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>{encBalanceHandle}</code>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleDecryptBalance} disabled={loading} style={{ padding: '8px 12px', background: '#4CAF50', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>{t('ctoken.decrypt_balance')}</button>
          </div>
          {decBalance !== null && (
            <div style={{ marginTop: '12px', background: '#e8f5e8', padding: '10px', borderRadius: '6px' }}>
              <p style={{ margin: 0 }}><strong>{t('ctoken.decrypted_balance_human')}:</strong> {decBalanceHuman}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '12px' }}>
        <h4>{t('ctoken.transfer_title')}</h4>
        <label style={{ display: 'block', fontWeight: 'bold' }}>{t('ctoken.to_addr')}</label>
        <input type="text" value={transferTo} onChange={(e)=>setTransferTo(e.target.value)} placeholder="0x..." style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '8px' }} />
        <label style={{ display: 'block', fontWeight: 'bold' }}>{t('ctoken.amount_human')}</label>
        <input type="text" value={transferAmt} onChange={(e)=>setTransferAmt(e.target.value)} placeholder={t('ctoken.human_decimals')} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }} />
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleTransfer} disabled={loading || !transferTo || !transferAmt} style={{ padding: '10px 16px', background: '#9C27B0', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>{t('ctoken.transfer_btn')}</button>
        </div>
        <div>Transfer Amount would be encrypted.</div>
      </div>

      {(txHash) && (
        <div style={{ background: '#f0f8ff', padding: '12px', borderRadius: '8px' }}>
          <p><strong>{t('common.tx_hash')}:</strong> {txHash}</p>
        </div>
      )}

      <div style={{ marginTop: '16px' }}>
        <h5>📝 {t('ctoken.sample_code')}</h5>
        <pre style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', fontSize: '12px', overflow: 'auto', margin: 0 }}>{`// Faucet
await contract.faucet()

// 1) Fetch encrypted balance (ciphertext handle)
const enc = await contract.confidentialBalanceOf(user)
const handle = enc.toString()
// ... createEIP712 + sign + instance.userDecrypt(...) ...
// decrypted = result[handle]

// 2) Encrypted transfer with human->atomic conversion
const decimals = await contract.decimals()
const toAtomic = (val) => {
  const [i,f=''] = String(val).split('.')
  const frac = (f + '0'.repeat(decimals)).slice(0, decimals)
  return BigInt((i||'0') + frac)
}
const amountAtomic = toAtomic('1.000000') // 1 token if 6 decimals
const input = instance.createEncryptedInput(tokenAddress, user)
input.add64(Number(amountAtomic.toString()))
const encrypted = await input.encrypt()
await contract.confidentialTransfer(to, encrypted.handles[0], encrypted.inputProof)`}</pre>
      </div>
    </div>
  )
}

export default ConfidentialToken
