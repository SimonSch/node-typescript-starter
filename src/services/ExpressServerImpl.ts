import {Service, Token} from 'typedi';
import {useExpressServer} from 'routing-controllers';
import {StatsController} from '../controllers/StatsController';
import {IServer} from '../interfaces/IServer';
import {Environment, EnvService} from './EnvService';
import {Logger} from '../decorators/Logger';
import {ILogger} from '../interfaces/ILogger';

import * as expressWinston from 'express-winston';
import * as winston from 'winston';
import * as express from 'express';
import * as Prometheus from 'prom-client';
import {HelloController} from '../controllers/HelloController';

export const ExpressServerImpl = new Token<IServer>();

@Service(ExpressServerImpl)
export class ExpressImpl implements IServer {

    private readonly app: express.Express;
    PrometheusMetrics: any;

    constructor(
        @Logger() private readonly logger: ILogger,
        private readonly envService: EnvService) {
        this.PrometheusMetrics = {
            requestCounter: new Prometheus.Counter('throughput', 'The number of requests served')
        };

        this.app = express();
        this.app.use((req, res, next) => {
            if (req.url.endsWith('/metrics')) {
                next();
                return;
            }
            this.PrometheusMetrics.requestCounter.inc();
            next();
        });

        this.addExpressLoggerMiddleware();

        useExpressServer(this.Instance, {
            controllers: [
                StatsController,
                HelloController
            ]
        });
    }

    private readonly addExpressLoggerMiddleware = (): void => {

        this.logger.verbose('Initializing winston logging middleware...');

        if (this.envService.Env === Environment.production) {
            this.Instance.use(expressWinston.errorLogger({
                transports: [
                    new winston.transports.Console({
                        json: true,
                        colorize: true
                    })
                ],
                winstonInstance: this.logger.Instance,
            }));
        } else {
            this.Instance.use(expressWinston.logger({
                transports: [
                    new winston.transports.Console({
                        json: true,
                        colorize: true
                    })
                ],
                winstonInstance: this.logger.Instance,
            }));
        }
    };

    public readonly start = (port: number): void => {
        this.Instance.listen(port);
    };

    get Instance(): express.Express {
        return this.app;
    }
}
