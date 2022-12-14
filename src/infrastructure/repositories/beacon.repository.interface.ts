import { HttpStatusCode } from 'axios';

export interface BeaconRepositoryInterface {
  getPeerCount(): Promise<number>;
  getSyncState(): Promise<boolean>;
  getHealthStatus(): Promise<HttpStatusCode>;
}
