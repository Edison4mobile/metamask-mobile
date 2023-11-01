import React from 'react';
import { ConnectedComponent } from 'react-redux';
import { waitFor } from '@testing-library/react-native';
import Confirm from '.';
import { renderScreen } from '../../../../util/test/renderWithProvider';
import Routes from '../../../../constants/navigation/Routes';
import initialBackgroundState from '../../../../util/test/initial-background-state.json';
import TransactionReviewEIP1559Update from '../../../UI/TransactionReview/TransactionReviewEIP1559Update';

const mockInitialState = {
  engine: {
    backgroundState: {
      ...initialBackgroundState,
      NetworkController: {
        network: '1',
        providerConfig: {
          ticker: 'ETH',
          type: 'mainnet',
        },
      },
      GasFeeController: {
        gasFeeEstimates: {
          low: '0x0',
          medium: '0x0',
          high: '0x0',
        },
        gasEstimateType: 'none',
      },
      AccountTrackerController: {
        accounts: { '0x2': { balance: '0' } },
      },
      CurrencyRateController: {
        currentCurrency: 'USD',
        conversionRate: 1,
        nativeCurrency: 'ETH',
      },
      PreferencesController: {
        identities: {
          '0x1': { name: 'Account1' },
        },
      },
      KeyringController: {
        keyrings: [{ accounts: ['0x'], type: 'HD Key Tree' }],
      },
    },
  },
  settings: {
    showHexData: true,
  },
  transaction: {
    selectedAsset: {},
    transaction: {
      from: '0x1',
      to: '0x2',
      value: '0x2',
      data: undefined,
    },
  },
  fiatOrders: {
    networks: [
      {
        active: true,
        chainId: 1,
        chainName: 'Ethereum Mainnet',
        nativeTokenSupported: true,
      },
    ],
  },
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest
    .fn()
    .mockImplementation((callback) => callback(mockInitialState)),
}));
jest.mock('../../../../core/GasPolling/GasPolling', () => ({
  ...jest.requireActual('../../../../core/GasPolling/GasPolling'),
  startGasPolling: jest.fn(),
  stopGasPolling: jest.fn(),
}));
jest.mock('../../../../util/ENSUtils', () => ({
  ...jest.requireActual('../../../../util/ENSUtils'),
  doENSReverseLookup: jest.fn(),
}));
jest.mock('../../../../util/address', () => ({
  ...jest.requireActual('../../../../util/address'),
  isQRHardwareAccount: jest.fn(),
}));
jest.mock('../../../../core/Engine', () => ({
  context: {
    TokensController: {
      addToken: jest.fn(),
    },
    GasFeeController: {
      getTimeEstimate: jest.fn(),
    },
  },
}));
jest.mock('../../../../util/custom-gas', () => ({
  ...jest.requireActual('../../../../util/custom-gas'),
  getGasLimit: jest.fn(),
}));
jest.mock('../../../../util/transactions', () => ({
  ...jest.requireActual('../../../../util/transactions'),
  decodeTransferData: jest.fn().mockImplementation(() => ['0x2']),
}));
jest.mock('../../../UI/TransactionReview/TransactionReviewEIP1559Update');

function render(Component: React.ComponentType | ConnectedComponent<any, any>) {
  return renderScreen(
    Component,
    {
      name: Routes.SEND_FLOW.CONFIRM,
    },
    {
      state: mockInitialState,
    },
  );
}

describe('Confirm', () => {
  it('should render correctly', async () => {
    const wrapper = render(Confirm);
    await waitFor(() => {
      expect(wrapper).toMatchSnapshot();
    });

    expect(TransactionReviewEIP1559Update).toHaveBeenCalled();
  });
});
