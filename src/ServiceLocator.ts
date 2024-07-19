type AvailableServices =
    | 'ImageLoader'
    | 'SceneManager'
    | 'Player'
    | 'WaveManager'
    | 'GeneratedSpritesManager'
    | 'CollideManager'
    | 'CannonConfigurationGenerator'
    | 'EventManager'
    | 'UtilManager'
    | 'EffectConfigurationGenerator'
    | 'SupportConfigurationGenerator'
    | 'SkillManager';
export class ServiceLocator {
    private static services: { [key: string]: unknown } = {};

    public static AddService(key: AvailableServices, service: unknown) {
        ServiceLocator.services[key] = service;
    }

    public static GetService<T>(key: AvailableServices): T {
        return ServiceLocator.services[key] as T;
    }
}
