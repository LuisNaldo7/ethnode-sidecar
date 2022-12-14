import { Module } from '@nestjs/common';
import { BeaconController } from './handler/controller/beacon.controller';
import { BeaconService } from './application/beacon.service';
import { ConfigModule } from '@nestjs/config';
import { BeaconRepository } from './infrastructure/repositories/beacon.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [BeaconController],
  providers: [
    {
      provide: 'BeaconRepository',
      useClass: BeaconRepository,
    },
    BeaconService,
  ],
})
export class AppModule {}
