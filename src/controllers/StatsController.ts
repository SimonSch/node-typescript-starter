import {Get, JsonController} from 'routing-controllers';
import {Logger} from '../decorators/Logger';
import {ILogger} from '../interfaces/ILogger';
import * as Prometheus from 'prom-client';

@JsonController('/metrics')
export class StatsController {

    @Logger()
    private readonly logger: ILogger;

    @Get('/')
    public readonly getStats = () => {
        return Prometheus.register.metrics();
    };

}
