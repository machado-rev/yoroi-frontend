// @flow

import BigNumber from 'bignumber.js';
import type {
  AddressUtxoFunc,
} from '../../lib/state-fetch/types';
import type {
  TransferTx
} from '../../../../types/TransferTypes';
import { RustModule } from '../../lib/cardanoCrypto/rustLoader';
import type {
  Address, Addressing
} from '../../lib/storage/models/PublicDeriver/interfaces';
import { buildYoroiTransferTx as legacyFormatYoroiTx } from '../byron/yoroiTransfer';
import { toSenderUtxos } from './utils';

export async function yoroiTransferTxFromAddresses(payload: {|
  addresses: Array<{| ...Address, ...Addressing |}>,
  outputAddr: string,
  keyLevel: number,
  signingKey: RustModule.WalletV4.Bip32PrivateKey,
  getUTXOsForAddresses: AddressUtxoFunc,
  absSlotNumber: BigNumber,
  protocolParams: {|
    keyDeposit: RustModule.WalletV4.BigNum,
    linearFee: RustModule.WalletV4.LinearFee,
    minimumUtxoVal: RustModule.WalletV4.BigNum,
    poolDeposit: RustModule.WalletV4.BigNum,
  |},
|}): Promise<TransferTx> {
  const senderUtxos = await toSenderUtxos({
    addresses: payload.addresses,
    getUTXOsForAddresses: payload.getUTXOsForAddresses,
  });
  return legacyFormatYoroiTx({
    outputAddr: payload.outputAddr,
    keyLevel: payload.keyLevel,
    signingKey: payload.signingKey,
    senderUtxos,
    protocolParams: payload.protocolParams,
    absSlotNumber: payload.absSlotNumber,
  });
}
