import { BeaconRepository } from 'src/infrastructure/repositories/beacon.repository';

export function mockBeaconRepository(): jest.Mocked<BeaconRepository> {
  return {
    getPeerCount: jest.fn(),
    getSyncState: jest.fn(),
    getHealthStatus: jest.fn(),
  } as unknown as jest.Mocked<BeaconRepository>;
}
