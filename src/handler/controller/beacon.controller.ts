import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BeaconService } from '../../application/beacon.service';

@ApiTags('Probes')
@Controller('eth2')
export class BeaconController {
  constructor(private readonly beaconService: BeaconService) {}

  @Get('readiness')
  @ApiOperation({
    summary: 'Readiness probe for beacon client.',
    description: 'Performs a readiness check on a beacon client.',
  })
  @ApiOkResponse({ description: 'Beacon client is ready to accept traffic.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async getReadinessEth2(): Promise<any> {
    try {
      return this.beaconService.getReadinessState();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get('liveness')
  @ApiOperation({
    summary: 'Liveness probe for beacon client.',
    description: 'Performs a liveness check on a beacon client.',
  })
  @ApiOkResponse({ description: 'Beacon client is healthy.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async getLivenessEth2(): Promise<any> {
    try {
      return this.beaconService.getLivenessState();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
