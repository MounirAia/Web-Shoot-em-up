type Services = 'ImageLoader' | 'Player' | 'WaveManager';
export class ServiceLocator {
    private static services: { [key: string]: unknown } = {};

    public static AddService(key: Services, service: unknown) {
        ServiceLocator.services[key] = service;
    }

    public static GetService<T>(key: Services): T {
        return ServiceLocator.services[key] as T;
    }
}
