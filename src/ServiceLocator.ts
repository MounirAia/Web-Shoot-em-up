interface Services {
    ImageLoader: 'ImageLoader';
    Player: 'Player';
}

export class ServiceLocator {
    private static services: { [key: string]: unknown } = {};

    public static addService(key: keyof Services, service: unknown) {
        ServiceLocator.services[key] = service;
    }

    public static getService<T>(key: keyof Services): T {
        return ServiceLocator.services[key] as T;
    }
}
