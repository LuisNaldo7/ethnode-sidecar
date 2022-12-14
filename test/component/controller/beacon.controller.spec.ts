import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { BeaconService } from '../../../src/application/beacon.service';
import { BeaconController } from '../../../src/handler/controller/beacon.controller';
import { BeaconRepository } from '../../../src/infrastructure/repositories/beacon.repository';
import { mockBeaconRepository } from '../../mock/beacon.repository.mock';

describe('BeaconController', () => {
  let app: INestApplication;
  let beaconRepositoryMock: jest.Mocked<BeaconRepository>;

  beforeAll(async () => {
    process.env.CLIENT_MIN_PEERS = '10';
    beaconRepositoryMock = mockBeaconRepository();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BeaconController],
      providers: [
        BeaconService,
        {
          provide: 'BeaconRepository',
          useValue: beaconRepositoryMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getReadinessEth2() /eth2/readiness (GET)', () => {
    it('readiness probe successful', async () => {
      const numPeers = 75;
      const isSyncing = false;

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);

      await request(app.getHttpServer()).get('/eth2/readiness').expect(200);
    });

    it('readiness probe failed', async () => {
      const error = new Error();
      const isSyncing = false;

      beaconRepositoryMock.getPeerCount.mockRejectedValueOnce(error);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);

      await request(app.getHttpServer()).get('/eth2/readiness').expect(500);
    });
  });

  describe('getLivenessEth2() /eth2/liveness (GET)', () => {
    it('liveness probe successful', async () => {
      const numPeers = 75;
      const isSyncing = false;
      const healthStatus = 200;

      beaconRepositoryMock.getPeerCount.mockResolvedValueOnce(numPeers);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);
      beaconRepositoryMock.getHealthStatus.mockResolvedValueOnce(healthStatus);

      await request(app.getHttpServer()).get('/eth2/liveness').expect(200);
    });

    it('liveness probe failed', async () => {
      const error = new Error();
      const isSyncing = false;
      const healthStatus = 200;

      beaconRepositoryMock.getPeerCount.mockRejectedValueOnce(error);
      beaconRepositoryMock.getSyncState.mockResolvedValueOnce(isSyncing);
      beaconRepositoryMock.getHealthStatus.mockResolvedValueOnce(healthStatus);

      await request(app.getHttpServer()).get('/eth2/liveness').expect(500);
    });
  });
});
