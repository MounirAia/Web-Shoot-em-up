export default class ServiceLocator {
    private static services: { [key: string]: unknown } = {};

    public static addService(key: string, service: unknown) {
        ServiceLocator.services[key] = service;
    }

    public static getService<T>(key: string): T {
        return ServiceLocator.services[key] as T;
    }
}
