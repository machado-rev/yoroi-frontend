// @flow

import type { ConceptualWalletSettingsCache } from '../../app/stores/toplevel/WalletSettingsStore';
import WalletSettingsStore from '../../app/stores/toplevel/WalletSettingsStore';
import TransactionsStore from '../../app/stores/toplevel/TransactionsStore';
import DelegationStore from '../../app/stores/toplevel/DelegationStore';
import WalletStore from '../../app/stores/toplevel/WalletStore';
import BaseCardanoTimeStore from '../../app/stores/base/BaseCardanoTimeStore';
import { PublicDeriver } from '../../app/api/ada/lib/storage/models/PublicDeriver';
import type { ByronCacheValue } from './cardano/ByronMocks';
import type { ShelleyCip1852CacheValue } from './cardano/ShelleyCip1852Mocks';
import type { JormungandrCacheValue } from './jormungandr/JormungandrMocks';

export type CardanoCacheValue = {|
  publicDeriver: PublicDeriver<>,
  conceptualWalletCache: ConceptualWalletSettingsCache,
  getPublicKeyCache:
    typeof WalletStore.prototype.getPublicKeyCache,
  getTransactions:
    typeof TransactionsStore.prototype.getTxRequests,
  getDelegation:
    typeof DelegationStore.prototype.getDelegationRequests,
  getSigningKeyCache:
    typeof WalletStore.prototype.getSigningKeyCache,
  getPublicDeriverSettingsCache:
    typeof WalletSettingsStore.prototype.getPublicDeriverSettingsCache,
  getTimeCalcRequests:
    typeof BaseCardanoTimeStore.prototype.getTimeCalcRequests,
  getCurrentTimeRequests:
    typeof BaseCardanoTimeStore.prototype.getCurrentTimeRequests,
|};

export type PossibleCacheTypes =
  ByronCacheValue |
  ShelleyCip1852CacheValue |
  JormungandrCacheValue;

export function walletLookup(wallets: $ReadOnlyArray<PossibleCacheTypes>): {|
  publicDerivers: Array<PublicDeriver<>>,
  getConceptualWalletSettingsCache:
    typeof WalletSettingsStore.prototype.getConceptualWalletSettingsCache,
  getPublicKeyCache:
    typeof WalletStore.prototype.getPublicKeyCache,
  getTransactions:
    typeof TransactionsStore.prototype.getTxRequests,
  getDelegation:
    typeof DelegationStore.prototype.getDelegationRequests,
  getSigningKeyCache:
    typeof WalletStore.prototype.getSigningKeyCache,
  getPublicDeriverSettingsCache:
    typeof WalletSettingsStore.prototype.getPublicDeriverSettingsCache,
  getTimeCalcRequests:
    typeof BaseCardanoTimeStore.prototype.getTimeCalcRequests,
  getCurrentTimeRequests:
    typeof BaseCardanoTimeStore.prototype.getCurrentTimeRequests,
|} {
  if (wallets.length === 0) {
    return ({
      publicDerivers: [],
      getConceptualWalletSettingsCache: (_conceptualWallet) => (null: any),
      getTransactions: (_publicDeriver) => (null: any),
      getDelegation: (_publicDeriver) => (null: any),
      getPublicKeyCache: (_publicDeriver) => (null: any),
      getSigningKeyCache: (_publicDeriver) => (null: any),
      getPublicDeriverSettingsCache: (_publicDeriver) => (null: any),
      getTimeCalcRequests: (_publicDeriver) => (null: any),
      getCurrentTimeRequests: (_publicDeriver) => (null: any),
    });
  }

  const asOption: { [key: string]: PublicDeriver<>, ... } = {};
  for (const wallet of wallets) {
    asOption[wallet.conceptualWalletCache.conceptualWalletName] = wallet.publicDeriver;
  }

  return ({
    publicDerivers: wallets.map(wallet => wallet.publicDeriver),
    getConceptualWalletSettingsCache: (conceptualWallet) => {
      for (const wallet of wallets) {
        if (wallet.publicDeriver.getParent() === conceptualWallet) {
          return wallet.conceptualWalletCache;
        }
      }
      throw new Error(`Missing cache entry for getConceptualWalletSettingsCache`);
    },
    getTransactions: (publicDeriver) => {
      for (const wallet of wallets) {
        if (wallet.publicDeriver === publicDeriver) {
          return wallet.getTransactions(publicDeriver);
        }
      }
      throw new Error(`Missing cache entry for transactions`);
    },
    getDelegation: (publicDeriver) => {
      for (const wallet of wallets) {
        if (wallet.publicDeriver === publicDeriver && wallet.getDelegation) {
          return wallet.getDelegation(publicDeriver);
        }
      }
      throw new Error(`Missing cache entry for delegation`);
    },
    getPublicKeyCache: (publicDeriver) => {
      for (const wallet of wallets) {
        if (wallet.publicDeriver === publicDeriver) {
          return wallet.getPublicKeyCache(publicDeriver);
        }
      }
      throw new Error(`Missing cache entry for publicKeyCache`);
    },
    getSigningKeyCache: (publicDeriver) => {
      for (const wallet of wallets) {
        if (wallet.publicDeriver === publicDeriver) {
          return wallet.getSigningKeyCache(publicDeriver);
        }
      }
      throw new Error(`Missing cache entry for getSigningKeyCache`);
    },
    getPublicDeriverSettingsCache: (publicDeriver) => {
      for (const wallet of wallets) {
        if (wallet.publicDeriver === publicDeriver) {
          return wallet.getPublicDeriverSettingsCache(publicDeriver);
        }
      }
      throw new Error(`Missing cache entry for getPublicDeriverSettingsCache`);
    },
    getTimeCalcRequests: (publicDeriver) => {
      for (const wallet of wallets) {
        if (wallet.publicDeriver === publicDeriver) {
          return wallet.getTimeCalcRequests(publicDeriver);
        }
      }
      throw new Error(`Missing cache entry for getTimeCalcRequests`);
    },
    getCurrentTimeRequests: (publicDeriver) => {
      for (const wallet of wallets) {
        if (wallet.publicDeriver === publicDeriver) {
          return wallet.getCurrentTimeRequests(publicDeriver);
        }
      }
      throw new Error(`Missing cache entry for getCurrentTimeRequests`);
    },
  });
}
