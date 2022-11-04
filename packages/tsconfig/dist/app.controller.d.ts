import { AppService } from "./app.service";
import { PartnerSearchResponse, RandomPartnerSearchResponse } from "models";
export declare class AppController {
    private appService;
    private logger;
    constructor(appService: AppService);
    subscribePartnerFoundEvent(data: PartnerSearchResponse): Promise<void>;
    subscribeRandomPartnerFoundEvent(data: RandomPartnerSearchResponse): Promise<void>;
}
