import * as Common from './host-api';

export namespace V1 {
  /** API сторонних компонентов. */
  export interface IRemoteComponentApi extends Common.IRemoteComponentApiBase {
    /**
     * Событие обновления контрола.
     */
    onControlUpdate?: ControlUpdateHandler;
    /**
     * Получить настройки компонента, указанные в конфиге сервера.
     */
    getSettings(): Promise<Record<string, string>>;
  }

  /** Контекст для стороннего контрола. */
  export interface IRemoteComponentContext extends Common.IRemoteComponentContextBase {
    /** Идентификатор пользователя. */
    userId: number | null;
    /** Текущая культура. */
    currentCulture: string | null;
    /** Тема. */
    theme: Common.Theme;
    /** Идентификатор клиента. */
    clientId: string | null;
    /** Тенант. */
    tenant: string | null;
    /** Лицензии на модули. */
    moduleLicenses: Array<Common.IModuleLicense>;
    /** Логгер. */
    logger: Common.ILogger;
  }

  /**
  * Обработчик обновления контрола.
  * @param context Контекст для стороннего контрола.
  */
  export type ControlUpdateHandler = (context: IRemoteComponentContext) => void;

  /** API сторонних компонентов для работы с карточкой. */
  export interface IRemoteComponentCardApi extends IRemoteComponentApi {
    /**
     * Выполнить действие.
     * @param actionName Название действия.
     */
    executeAction: (actionName: string) => Promise<void>;
    /**
     * Проверить, можно ли выполнить действие.
     * @param actionName Название действия.
     * @returns True, если возможно выполнить действие.
     */
    canExecuteAction: (actionName: string) => boolean;
    /**
     * Получить сущность из карточки.
     */
    getEntity<T extends Common.IEntity>(): T;
  }

  /** API сторонних компонентов для работы с обложкой. */
  export interface IRemoteComponentCoverApi extends IRemoteComponentApi {
    /**
     * Выполнить действие.
     * @param id Идентификатор действия.
     */
    executeAction: (id: Common.Guid) => Promise<void>;
    /**
     * Получить информацию о действиях на обложке.
     * @returns Коллекция метаданных действия обложки.
     */
    getActionsMetadata(): Array<Common.IRemoteCoverActionMetadata>;
  }

  /** Аргументы загрузчика контрола. */
  export interface ILoaderArgs extends Common.ILoaderArgsBase {
    /** Контейнер. */
    container: HTMLElement;
    /** Контекст инициализации. */
    initialContext: IRemoteComponentContext;
    /** API сторонних компонентов. */
    api: IRemoteComponentApi;
    /** Параметры стороннего контрола.*/
    controlInfo: Common.IRemoteControlInfo;
  }
}
