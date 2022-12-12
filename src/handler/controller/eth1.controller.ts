import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Eth1StateService } from '../../application/eth1.service';

@ApiTags('Eth1 Probes')
@Controller('eth1')
export class Eth1Controller {
  constructor(private readonly eth1StateService: Eth1StateService) {}

  @Get('readiness')
  @ApiOperation({
    summary: 'Readiness probe for execution client.',
    description: 'Performs a readiness check on an execution client.',
  })
  @ApiOkResponse({
    description: 'Execution client is ready to accept traffic.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async getReadinessEth1(): Promise<any> {
    try {
      return this.eth1StateService.getReadinessState();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get('liveness')
  @ApiOperation({
    summary: 'Liveness probe for execution client.',
    description: 'Performs a liveness check on an execution client.',
  })
  @ApiOkResponse({ description: 'Execution client is healthy.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async getLivenessEth1(): Promise<any> {
    try {
      return this.eth1StateService.getLivenessState();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
