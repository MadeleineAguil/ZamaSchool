import { useState } from 'react'
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

  const [decBalance, setDecBalance] = useState(null)
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

  const handleViewAndDecryptBalance = async () => {
    if (!ensureReady()) return
    if (!walletClient) { alert(t('common.connect_wallet')); return }
    setLoading(true)
    try {
      const s = await signer
      const contract = new Contract(CONTRACT_ADDRESS, ConfidentialUSDTABI, s)
      const encBal = await contract.balanceOf(address)
      const handle = encBal.toString()

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
      setDecBalance((dec !== undefined && dec !== null) ? dec.toString() : '')
    } catch (e) {
      console.error(e)
      alert(t('ctoken.decrypt_failed') + ' ' + (e?.message || e))
    } finally { setLoading(false) }
  }

  const handleTransfer = async () => {
    if (!ensureReady()) return
    if (!transferTo || !transferAmt) { alert(t('ctoken.need_to_and_amount')); return }
    setLoading(true)
    try {
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address)
      input.add64(parseInt(transferAmt))
      const encryptedInput = await input.encrypt()

      const s = await signer
      const contract = new Contract(CONTRACT_ADDRESS, ConfidentialUSDTABI, s)

      let tx
      // try transferEncrypted first, else fallback to transfer
      try {
        tx = await contract.transferEncrypted(encryptedInput.handles[0], encryptedInput.inputProof, transferTo)
      } catch (_) {
        tx = await contract.transfer(encryptedInput.handles[0], encryptedInput.inputProof, transferTo)
      }
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

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>{t('ctoken.section_title')}</h3>

      <div style={{ marginBottom: '16px', background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>{t('ctoken.intro_1')}</p>
        <p style={{ margin: 0 }}>{t('ctoken.intro_2')}</p>
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

      <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
        <button onClick={handleFaucet} disabled={loading} style={{ padding: '10px 16px', background: '#2196F3', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>{t('ctoken.call_faucet')}</button>
        <button onClick={handleViewAndDecryptBalance} disabled={loading} style={{ padding: '10px 16px', background: '#4CAF50', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>{t('ctoken.view_decrypt_balance')}</button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <h4>{t('ctoken.transfer_title')}</h4>
        <label style={{ display: 'block', fontWeight: 'bold' }}>{t('ctoken.to_addr')}</label>
        <input type="text" value={transferTo} onChange={(e)=>setTransferTo(e.target.value)} placeholder="0x..." style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '8px' }} />
        <label style={{ display: 'block', fontWeight: 'bold' }}>{t('ctoken.amount')}</label>
        <input type="number" value={transferAmt} onChange={(e)=>setTransferAmt(e.target.value)} placeholder="1000000 (6 decimals)" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }} />
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleTransfer} disabled={loading || !transferTo || !transferAmt} style={{ padding: '10px 16px', background: '#9C27B0', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>{t('ctoken.transfer_btn')}</button>
        </div>
      </div>

      {(txHash || decBalance !== null) && (
        <div style={{ background: '#f0f8ff', padding: '12px', borderRadius: '8px' }}>
          {txHash && (<p><strong>{t('common.tx_hash')}:</strong> {txHash}</p>)}
          {decBalance !== null && (
            <p><strong>{t('ctoken.decrypted_balance')}:</strong> {decBalance}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: '16px' }}>
        <h5>📝 {t('ctoken.sample_code')}</h5>
        <pre style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', fontSize: '12px', overflow: 'auto', margin: 0 }}>{`// Faucet
await contract.faucet()

// View + decrypt balance
const enc = await contract.balanceOf(user)
const handle = enc.toString()
// ... createEIP712 + sign + userDecrypt ... -> result[handle]

// Transfer encrypted amount
const input = instance.createEncryptedInput(tokenAddress, user)
input.add64(amount)
const encrypted = await input.encrypt()
await contract.transferEncrypted(encrypted.handles[0], encrypted.inputProof, to)`}</pre>
      </div>
    </div>
  )
}

export default ConfidentialToken

