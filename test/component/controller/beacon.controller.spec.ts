import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('BeaconController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getLivenessEth2 endpoint', () => {
    it('/eth2/liveness (GET) lifeness probe successful', async () => {
      await request(app.getHttpServer()).get('/eth2/liveness').expect(200);
    });
  });
});
