import { Module } from '@nestjs/common';
import { Eth1Controller } from './handler/controller/eth1.controller';
import { Eth2Controller } from './handler/controller/eth2.controller';
import { Eth1StateService } from './application/eth1.service';
import { Eth2StateService } from './application/eth2.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [Eth1Controller, Eth2Controller],
  providers: [Eth1StateService, Eth2StateService],
})
export class AppModule {}
