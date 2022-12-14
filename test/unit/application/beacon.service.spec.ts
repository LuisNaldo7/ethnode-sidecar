import { Test, TestingModule } from '@nestjs/testing';
import { BeaconRepository } from '../../../src/infrastructure/repositories/beacon.repository';
import { mockBeaconRepository } from '../../mock/beacon.repository.mock';
import { BeaconService } from '../../../src/application/beacon.service';
import { RequestTimeoutException } from '@nestjs/common';

describe('BeaconService', () => {
  let beaconService: BeaconService;
  let beaconRepositoryMock: jest.Mocked<BeaconRepository>;

  beforeAll(() => {
    process.env.CLIENT_MIN_PEERS = '10';
  });

  beforeEach(async () => {
    beaconRepositoryMock = mockBeaconRepository();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],

      providers: [
        BeaconService,
        {
          provide: 'BeaconRepository',
          useValue: beaconRepositoryMock,
        },
      ],
    }).compile();
    beaconService = module.get<BeaconService>(BeaconService);
  });

  describe('getReadinessState', () => {
    it('client is ready', async () => {
      const numPeers = 75;
      const isSyncing = false;

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);

      const response = await beaconService.getReadinessState();
      expect(response).toBeUndefined();
    });

    it('client is is not ready due to low peers', async () => {
      const numPeers = 9;
      const isSyncing = false;

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);

      expect(async () => {
        await beaconService.getReadinessState();
      }).rejects.toThrow(Error);
    });

    it('client is is not ready due to sync state', async () => {
      const numPeers = 75;
      const isSyncing = true;

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);

      expect(async () => {
        await beaconService.getReadinessState();
      }).rejects.toThrow(Error);
    });

    it('client is not ready due to connection timeout', async () => {
      const timeout = new RequestTimeoutException();
      const isSyncing = true;

      beaconRepositoryMock.getPeerCount.mockRejectedValueOnce(timeout);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);

      expect(async () => {
        await beaconService.getReadinessState();
      }).rejects.toThrow(Error);
    });
  });

  describe('getLivenessState', () => {
    it('client is ready', async () => {
      const numPeers = 75;
      const isSyncing = false;
      const healthStatus = 200;

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);
      beaconRepositoryMock.getHealthStatus.mockResolvedValueOnce(healthStatus);

      const response = await beaconService.getLivenessState();
      expect(response).toBeUndefined();
    });

    it('client is is not ready due to low peers', async () => {
      const numPeers = 9;
      const isSyncing = false;
      const healthStatus = 200;

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);
      beaconRepositoryMock.getHealthStatus.mockResolvedValueOnce(healthStatus);

      expect(async () => {
        await beaconService.getLivenessState();
      }).rejects.toThrow(Error);
    });

    it('client is is not ready due to sync state', async () => {
      const numPeers = 75;
      const isSyncing = true;
      const healthStatus = 200;

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);
      beaconRepositoryMock.getHealthStatus.mockResolvedValueOnce(healthStatus);

      expect(async () => {
        await beaconService.getLivenessState();
      }).rejects.toThrow(Error);
    });

    it('client is is not ready due to unhealthy status', async () => {
      const numPeers = 75;
      const isSyncing = false;
      const healthStatus = 206;

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);
      beaconRepositoryMock.getHealthStatus.mockResolvedValueOnce(healthStatus);

      expect(async () => {
        await beaconService.getLivenessState();
      }).rejects.toThrow(Error);
    });

    it('client is not ready due to connection timeout', async () => {
      const numPeers = 75;
      const isSyncing = false;
      const timeout = new RequestTimeoutException();

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);
      beaconRepositoryMock.getHealthStatus.mockRejectedValueOnce(timeout);

      expect(async () => {
        await beaconService.getLivenessState();
      }).rejects.toThrow(Error);
    });
  });
});
