import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Eth2StateService } from '../../application/eth2.service';

@ApiTags('Eth2 Probes')
@Controller('eth2')
export class Eth2Controller {
  constructor(private readonly eth2StateService: Eth2StateService) {}

  @Get('readiness')
  @ApiOperation({
    summary: 'Readiness probe for beacon client.',
    description: 'Performs a readiness check on a beacon client.',
  })
  @ApiOkResponse({ description: 'Beacon client is ready to accept traffic.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async getReadinessEth2(): Promise<any> {
    try {
      return this.eth2StateService.getReadinessState();
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
      return this.eth2StateService.getLivenessState();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
