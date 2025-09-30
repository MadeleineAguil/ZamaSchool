import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

const I18nContext = createContext({
  lang: 'en',
  t: (key) => key,
  setLang: () => {}
})

const translations = {
  en: {
    // General
    'app.title': 'ZamaSchool - FHE Learning Platform',
    'app.subtitle': "Learn Zama's Fully Homomorphic Encryption technology and experience privacy-preserving blockchain computing",
    'sidebar.title': 'Zama Learning Catalog',
    'sidebar.subtitle': 'Click chapter to start learning',
    'progress.title': 'Learning Progress',
    'wallet.connected': 'Wallet Connected',
    'wallet.required.title': 'Wallet Connection Required',
    'wallet.required.desc': "Please connect your wallet to continue learning this chapter's content.",
    'nav.prev': '← Previous',
    'nav.next': 'Next →',
    'footer.text': 'Powered by Zama | Fully Homomorphic Encryption Learning Platform',
    // Chapters
    'chapter.intro': 'Course Introduction',
    'chapter.zama_intro': 'Zama Technology Introduction',
    'chapter.sdk': 'SDK Introduction',
    'chapter.number_storage': 'Encrypted Number Storage',
    'chapter.number_decrypt': 'Number Decryption',
    'chapter.address_storage': 'Encrypted Address Storage',
    'chapter.address_decrypt': 'Address Decryption',
    'chapter.onchain_decrypt': 'Onchain Decryption Request',
    'chapter.calculations': 'FHE Encrypted Calculations',
    'chapter.number_comparison': 'Encrypted Number Comparison',
    'chapter.conclusion': 'Learning Summary',
    // Intro
    'intro.path_guide': 'Learning Path Guide',
    'intro.welcome': "Welcome to ZamaSchool! This is an interactive platform designed specifically for learning Zama's Fully Homomorphic Encryption technology. Follow these steps to learn progressively:",
    'intro.prep_title': 'Preparation Before Learning',
    'intro.experience_title': 'Learning Experience:',
    'intro.experience_1': 'Experience real blockchain interaction processes',
    'intro.experience_2': 'Learn encrypted data storage and reading operations',
    'intro.experience_3': "Practice using Zama's FHE capabilities",
    'intro.experience_4': 'Understand how decentralized applications work',
    'intro.privacy_title': 'Privacy Protection Features:',
    'intro.privacy_1': 'Data is fully encrypted on the blockchain',
    'intro.privacy_2': 'Only you can decrypt your own data',
    'intro.privacy_3': 'Supports mathematical operations on encrypted data',
    'intro.privacy_4': 'Third parties cannot access your private information',
    // Chapter descriptions
    'desc.zama_intro': 'Deep dive into Zama FHE technology principles and architecture',
    'desc.sdk': "Understand basic concepts and configuration of Zama frontend SDK",
    'desc.number_storage': 'Learn how to encrypt numbers and store them on blockchain',
    'desc.number_decrypt': 'Master methods for reading and decrypting numbers from blockchain',
    'desc.address_storage': 'Experience encrypted storage of Ethereum addresses',
    'desc.address_decrypt': 'Practice address data decryption operations',
    'desc.onchain_decrypt': 'Learn requestDecryption for onchain asynchronous decryption',
    'desc.calculations': 'Explore the powerful capabilities of homomorphic encrypted computation',
    'desc.number_comparison': 'Learn encrypted number comparison operations and conditional logic',
    // Conclusion
    'conclusion.title': 'Congratulations on Completing the Course!',
    'conclusion.desc': 'You have mastered the core concepts of Zama FHE technology:',
    'conclusion.li1': 'Understood the basic principles of Fully Homomorphic Encryption',
    'conclusion.li2': 'Learned to use the Zama frontend SDK',
    'conclusion.li3': 'Mastered encrypted data storage and retrieval',
    'conclusion.li4': 'Experienced privacy-preserving computation capabilities',
    'conclusion.next_steps': 'Next Steps:',
    'conclusion.next1': 'Try building your own privacy-preserving DApp',
    'conclusion.next2': "Deep dive into advanced features of Zama's Solidity library",
    'conclusion.next3': 'Explore more complex FHE algorithms and application scenarios',
    'conclusion.next4': 'Join the Zama community and share your learning experience'
  },
  zh: {
    'app.title': 'ZamaSchool - FHE 学习平台',
    'app.subtitle': '学习 Zama 的全同态加密技术，体验隐私保护的区块链计算',
    'sidebar.title': 'Zama 学习目录',
    'sidebar.subtitle': '点击章节开始学习',
    'progress.title': '学习进度',
    'wallet.connected': '钱包已连接',
    'wallet.required.title': '需要连接钱包',
    'wallet.required.desc': '请先连接钱包以继续学习本章节内容。',
    'nav.prev': '← 上一章',
    'nav.next': '下一章 →',
    'footer.text': '由 Zama 驱动 | 全同态加密学习平台',
    'chapter.intro': '课程简介',
    'chapter.zama_intro': 'Zama 技术介绍',
    'chapter.sdk': 'SDK 介绍',
    'chapter.number_storage': '加密数字存储',
    'chapter.number_decrypt': '数字解密',
    'chapter.address_storage': '加密地址存储',
    'chapter.address_decrypt': '地址解密',
    'chapter.onchain_decrypt': '链上解密请求',
    'chapter.calculations': 'FHE 加密计算',
    'chapter.number_comparison': '加密数字比较',
    'chapter.conclusion': '学习总结',
    'intro.path_guide': '学习路径指引',
    'intro.welcome': '欢迎来到 ZamaSchool！这是一个专为学习 Zama 全同态加密技术而设计的交互式平台。请按以下步骤循序渐进地学习：',
    'intro.prep_title': '学习前准备',
    'intro.experience_title': '学习体验：',
    'intro.experience_1': '体验真实的区块链交互流程',
    'intro.experience_2': '学习加密数据的存储与读取操作',
    'intro.experience_3': '实践使用 Zama 的 FHE 能力',
    'intro.experience_4': '理解去中心化应用的工作方式',
    'intro.privacy_title': '隐私保护特性：',
    'intro.privacy_1': '数据在链上始终加密存储',
    'intro.privacy_2': '只有你可以解密自己的数据',
    'intro.privacy_3': '支持对加密数据进行数学运算',
    'intro.privacy_4': '第三方无法获取你的隐私信息',
    'desc.zama_intro': '深入了解 Zama FHE 技术原理与架构',
    'desc.sdk': '理解 Zama 前端 SDK 的基本概念与配置',
    'desc.number_storage': '学习如何对数字加密并上链存储',
    'desc.number_decrypt': '掌握从区块链读取并解密数字的方法',
    'desc.address_storage': '体验以太坊地址的加密存储',
    'desc.address_decrypt': '练习地址数据的解密操作',
    'desc.onchain_decrypt': '学习使用 requestDecryption 进行链上异步解密',
    'desc.calculations': '探索同态加密计算的强大能力',
    'desc.number_comparison': '学习加密数字比较与条件逻辑',
    'conclusion.title': '🎉 恭喜完成本课程！',
    'conclusion.desc': '你已经掌握了 Zama FHE 技术的核心概念：',
    'conclusion.li1': '✅ 理解全同态加密的基本原理',
    'conclusion.li2': '✅ 学会使用 Zama 前端 SDK',
    'conclusion.li3': '✅ 掌握加密数据的存储与读取',
    'conclusion.li4': '✅ 体验隐私保护计算能力',
    'conclusion.next_steps': '🚀 下一步：',
    'conclusion.next1': '尝试构建你自己的隐私保护 DApp',
    'conclusion.next2': '深入学习 Zama Solidity 库的高级特性',
    'conclusion.next3': '探索更复杂的 FHE 算法与应用场景',
    'conclusion.next4': '加入 Zama 社区并分享你的学习经验'
  },
  fr: {
    'app.title': 'ZamaSchool - Plateforme d’apprentissage FHE',
    'app.subtitle': "Apprenez le chiffrement homomorphe complet de Zama et découvrez l’informatique préservant la vie privée sur blockchain",
    'sidebar.title': 'Catalogue d’apprentissage Zama',
    'sidebar.subtitle': 'Cliquez sur un chapitre pour commencer',
    'progress.title': 'Progression',
    'wallet.connected': 'Portefeuille connecté',
    'wallet.required.title': 'Connexion du portefeuille requise',
    'wallet.required.desc': 'Veuillez connecter votre portefeuille pour continuer ce chapitre.',
    'nav.prev': '← Précédent',
    'nav.next': 'Suivant →',
    'footer.text': 'Propulsé par Zama | Plateforme d’apprentissage FHE',
    'chapter.intro': 'Introduction du cours',
    'chapter.zama_intro': 'Introduction à la technologie Zama',
    'chapter.sdk': 'Introduction au SDK',
    'chapter.number_storage': 'Stockage de nombres chiffrés',
    'chapter.number_decrypt': 'Déchiffrement de nombres',
    'chapter.address_storage': 'Stockage d’adresses chiffrées',
    'chapter.address_decrypt': 'Déchiffrement d’adresses',
    'chapter.onchain_decrypt': 'Demande de déchiffrement on‑chain',
    'chapter.calculations': 'Calculs chiffrés FHE',
    'chapter.number_comparison': 'Comparaison de nombres chiffrés',
    'chapter.conclusion': 'Résumé',
    'intro.path_guide': 'Guide du parcours d’apprentissage',
    'intro.welcome': "Bienvenue sur ZamaSchool ! Une plateforme interactive dédiée à l’apprentissage du FHE de Zama. Suivez ces étapes pour progresser :",
    'intro.prep_title': 'Préparation avant de commencer',
    'intro.experience_title': 'Expérience d’apprentissage :',
    'intro.experience_1': 'Vivez de vraies interactions blockchain',
    'intro.experience_2': 'Apprenez le stockage et la lecture de données chiffrées',
    'intro.experience_3': 'Pratiquez les capacités FHE de Zama',
    'intro.experience_4': 'Comprenez le fonctionnement des DApps',
    'intro.privacy_title': 'Fonctionnalités de confidentialité :',
    'intro.privacy_1': 'Données entièrement chiffrées sur la blockchain',
    'intro.privacy_2': 'Vous seul pouvez déchiffrer vos données',
    'intro.privacy_3': 'Prise en charge des opérations mathématiques sur données chiffrées',
    'intro.privacy_4': 'Aucun tiers n’accède à vos informations privées',
    'desc.zama_intro': 'Plongez dans les principes et l’architecture du FHE de Zama',
    'desc.sdk': 'Comprenez les concepts de base et la configuration du SDK frontend de Zama',
    'desc.number_storage': 'Apprenez à chiffrer des nombres et les stocker on‑chain',
    'desc.number_decrypt': 'Maîtrisez la lecture et le déchiffrement de nombres depuis la blockchain',
    'desc.address_storage': 'Découvrez le stockage chiffré des adresses Ethereum',
    'desc.address_decrypt': 'Entraînez‑vous au déchiffrement d’adresses',
    'desc.onchain_decrypt': 'Apprenez requestDecryption pour le déchiffrement asynchrone on‑chain',
    'desc.calculations': 'Explorez la puissance des calculs homomorphes',
    'desc.number_comparison': 'Apprenez la comparaison chiffrée et la logique conditionnelle',
    'conclusion.title': '🎉 Félicitations pour la fin du cours !',
    'conclusion.desc': 'Vous avez maîtrisé les concepts clés de la technologie FHE de Zama :',
    'conclusion.li1': '✅ Compréhension des principes de base du FHE',
    'conclusion.li2': '✅ Utilisation du SDK frontend de Zama',
    'conclusion.li3': '✅ Maîtrise du stockage et de la récupération de données chiffrées',
    'conclusion.li4': '✅ Expérience des capacités de calcul préservant la vie privée',
    'conclusion.next_steps': '🚀 Prochaines étapes :',
    'conclusion.next1': 'Essayez de créer votre propre DApp préservant la vie privée',
    'conclusion.next2': 'Approfondissez les fonctionnalités avancées de la bibliothèque Solidity de Zama',
    'conclusion.next3': 'Explorez des algorithmes FHE et des cas d’usage plus complexes',
    'conclusion.next4': 'Rejoignez la communauté Zama et partagez votre expérience'
  }
}

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null
    if (saved && translations[saved]) {
      setLang(saved)
    }
  }, [])

  const t = useMemo(() => {
    const dict = translations[lang] || translations.en
    return (key) => dict[key] || translations.en[key] || key
  }, [lang])

  const value = useMemo(() => ({
    lang,
    setLang: (l) => {
      if (translations[l]) {
        setLang(l)
        if (typeof window !== 'undefined') window.localStorage.setItem('lang', l)
      }
    },
    t
  }), [lang, t])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
