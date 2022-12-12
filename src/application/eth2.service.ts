import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class Eth2StateService {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.ETH2_PROVIDER,
    });
  }

  async getReadinessState(): Promise<void> {
    try {
      const responseSyncing = await this.instance.get("eth/v1/node/syncing");
      if (responseSyncing.data.data.is_syncing) {
        throw new Error("Status Error. Beacon client is still syncing.");
      }
      console.log("Status OK. Beacon client is ready.");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLivenessState(): Promise<void> {
    try {
      const responseSyncing = await this.instance.get("eth/v1/node/syncing");
      if (responseSyncing.data.data.is_syncing) {
        throw new Error("Status Error. Beacon client is still syncing.");
      }

      const responseHealth = await this.instance.get("eth/v1/node/health");
      switch (responseHealth.status) {
        case 200:
          break;
        case 206:
          throw new Error(
            "Status Error. Beacon client is still syncing and can only serve incomplete data."
          );
        case 503:
          throw new Error(
            "Status Error. Beacon client is not initialized or having issues."
          );
        default: {
          throw new Error("Status Error. Beacon client status unknown.");
        }
      }

      console.log("Status OK. Beacon client is healthy.");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
