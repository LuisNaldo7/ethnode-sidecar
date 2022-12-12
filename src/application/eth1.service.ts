import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class Eth1StateService {
  private readonly web3: Web3;

  constructor() {
    this.web3 = new Web3(
      `${process.env.CLIENT_SCHEME}://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
    );
  }

  async getReadinessState(): Promise<void> {
    try {
      await this.healthCheck();
      console.log('Status OK. Execution client node is ready.');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLivenessState(): Promise<void> {
    try {
      await this.healthCheck();
      console.log('Status OK. Execution client is healthy.');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async healthCheck(): Promise<void> {
    const numConnectedPeers = await this.web3.eth.net.getPeerCount();
    if (numConnectedPeers < 3) {
      throw new Error('Status Error. Number of connected peers less than 3');
    }

    const response: any = await this.web3.eth.isSyncing();
    if (typeof response === 'boolean' && response === false) {
      return;
    } else {
      const currentBlock = response.currentBlock;
      const highestBlock = response.highestBlock;
      if (highestBlock - currentBlock > 50) {
        throw new Error(
          `Status Error. HighestBlock - CurrentBlock < 50, highestBlock: ${highestBlock}, currentBlock: ${currentBlock}, difference: ${
            highestBlock - currentBlock
          }`,
        );
      }
    }
  }
}
