import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, HttpStatusCode } from 'axios';
import { BeaconRepositoryInterface } from './beacon.repository.interface';

@Injectable()
export class BeaconRepository implements BeaconRepositoryInterface {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: `${process.env.CLIENT_SCHEME}://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
    });
  }

  async getPeerCount(): Promise<number> {
    const response = await this.instance.get('eth/v1/node/peer_count');
    return response.data.data.connected;
  }

  async getSyncState(): Promise<boolean> {
    const response = await this.instance.get('eth/v1/node/syncing');
    return (
      response.data.data.is_syncing ||
      response.data.data.is_optimistic ||
      response.data.data.el_offline
    );
  }

  async getHealthStatus(): Promise<HttpStatusCode> {
    const response = await this.instance.get('eth/v1/node/health');
    return response.status;
  }
}
