import { Test, TestingModule } from '@nestjs/testing';
import { BeaconService } from '../../../src/application/beacon.service';

describe('BeaconService', () => {
  let beaconService: BeaconService;

  beforeAll(() => {});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [BeaconService],
    }).compile();
    beaconService = module.get<BeaconService>(BeaconService);
  });

  describe('getReadinessState', () => {
    it('', async () => {
      const result = await beaconService.getReadinessState();
      expect(result).toReturn();
    });

    it('', async () => {
      await expect(async () => {
        await beaconService.getReadinessState();
      }).rejects.toThrow(Error);
    });
  });
});
