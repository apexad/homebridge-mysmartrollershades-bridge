export interface MySmartRollerShadesConfig {
    username?: string;
    password?: string;
    closeUp?: boolean;
    allowDebug?: boolean;
    statusLog?: boolean;
    pollingInterval?: number;
}

export interface MySmartRollerShadesAuth {
    username: string;
    password: string;
}

export interface MySmartRollerShade {
    id: string;
    name: string;
}
