import { Module } from '@nestjs/common';
import { BeaconController } from './handler/controller/beacon.controller';
import { BeaconService } from './application/beacon.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [BeaconController],
  providers: [BeaconService],
})
export class AppModule {}
