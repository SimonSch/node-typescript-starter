import {Get, JsonController} from 'routing-controllers';
import {Logger} from '../decorators/Logger';
import {ILogger} from '../interfaces/ILogger';

@JsonController('/hello')
export class HelloController {

    @Logger()
    private readonly logger: ILogger;

    @Get('/')
    public readonly getGreeting = () => {
        return 'HelloWorld';
    };

}
