import { Inject, Injectable } from '@nestjs/common';
import { BeaconRepositoryInterface } from 'src/infrastructure/repositories/beacon.repository.interface';

@Injectable()
export class BeaconService {
  constructor(
    @Inject('BeaconRepository')
    private readonly beaconNode: BeaconRepositoryInterface,
  ) {}

  async getReadinessState(): Promise<void> {
    const logPrefix = `[Readiness] - ${new Date().toLocaleString()}     `;

    try {
      const numPeers = await this.beaconNode.getPeerCount();
      if (numPeers < +process.env.CLIENT_MIN_PEERS) {
        throw new Error(
          `Status Error. Beacon client has low peers (${numPeers}/${process.env.CLIENT_MIN_PEERS}).`,
        );
      }

      const isSyncing = await this.beaconNode.getSyncState();
      if (isSyncing) {
        throw new Error('Status Error. Beacon client is still syncing or execution client is offline.');
      }

      console.info(`${logPrefix}Status OK. Beacon client is ready.`);
    } catch (error) {
      console.error(`${logPrefix}${error}`);
      throw error;
    }
  }

  async getLivenessState(): Promise<void> {
    const logPrefix = `[Liveness]  - ${new Date().toLocaleString()}     `;

    try {
      const numPeers = await this.beaconNode.getPeerCount();
      if (numPeers < +process.env.CLIENT_MIN_PEERS) {
        throw new Error(
          `Status Error. Beacon client has low peers (${numPeers}/${process.env.CLIENT_MIN_PEERS}).`,
        );
      }

      const isSyncing = await this.beaconNode.getSyncState();
      if (isSyncing) {
        throw new Error('Status Error. Beacon client is still syncing or execution client is offline.');
      }

      const healthStatus = await this.beaconNode.getHealthStatus();
      switch (healthStatus) {
        case 200:
          break;
        case 206:
          throw new Error(
            'Status Error. Beacon client is still syncing and can only serve incomplete data.',
          );
        case 503:
          throw new Error(
            'Status Error. Beacon client is not initialized or having issues.',
          );
        default: {
          throw new Error('Status Error. Beacon client status unknown.');
        }
      }

      console.info(`${logPrefix}Status OK. Beacon client is healthy.`);
    } catch (error) {
      console.error(`${logPrefix}${error}`);
      throw error;
    }
  }
}
