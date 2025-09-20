import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia } from 'wagmi/chains'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd'

export const config = getDefaultConfig({
  appName: 'ZamaSchool',
  projectId,
  chains: [mainnet, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
})