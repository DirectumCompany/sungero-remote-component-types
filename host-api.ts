export type Guid = string;

/** Метаданные действия обложки. */
export interface IRemoteCoverActionMetadata {
  id: Guid;
  title: string;
  description: string;
}

/** Информация о лицензии на модуль. */
export interface IModuleLicense {
  /** Название модуля. */
  name: string;
  /** Версия модуля. */
  version: string;
}

/** Аргументы логирования. */
type LoggerArgs = Array<Object | string>;

/** Логгер. */
export interface ILogger {
  /**
   * Вывести в лог сообщение уровня error.
   * @param ex Исключение.
   * @param messageTemplate Шаблон сообщения.
   * @param args Аргументы.
   */
  error(ex: Error, messageTemplate?: string, ...args: LoggerArgs): void;

  /**
   * Вывести в лог сообщение уровня error.
   * @param messageTemplate Шаблон сообщения.
   * @param args Аргументы.
   */
  error(messageTemplate: string, ...args: LoggerArgs): void;
  /**
   * Вывести в лог сообщение уровня warning.
   * @param messageTemplate Шаблон сообщения.
   * @param args Аргументы.
   */
  warning(messageTemplate: string, ...args: LoggerArgs): void;
  /**
   * Вывести в лог сообщение уровня info.
   * @param messageTemplate Шаблон сообщения.
   * @param args Аргументы.
   */
  info(messageTemplate: string, ...args: LoggerArgs): void;
  /**
   * Вывести в лог сообщение уровня debug.
   * @param messageTemplate Шаблон сообщения.
   * @param args Аргументы.
   */
  debug(messageTemplate: string, ...args: LoggerArgs): void;
}

/** Темы. */
export enum Theme {
  /** По умолчанию (светлая). */
  Default = 'Default',
  /** Ночная. */
  Night = 'Night'
}

/** Контекст для стороннего контрола. */
export interface IRemoteComponentContextBase {
}

/** Информация о свойстве сущности. */
export interface IEntityPropertyInfo {
  /** Название. */
  name: string;
  /** Тип свойства. */
  type: string;
  /** Отображаемое имя свойства. */
  displayValue: string;
}

/** Информация о свойстве-перечислении сущности. */
export interface IEntityEnumPropertyInfo extends IEntityPropertyInfo {
  /** Значения перечисления. */
  enumValues: Array<IEnumPropertyValue>;
}

/** Информация о свойстве-навигации сущности. */
export interface IEntityNavigationPropertyInfo extends IEntityPropertyInfo {
  /** Идентификатор типа, на который ссылается свойство. */
  typeId: Guid;
}

/** Информация о сущности. */
export interface IEntityInfo {
  /** Идентификатор типа. */
  typeId: Guid;
  /** Информация о свойствах сущности. */
  properties: Array<IEntityPropertyInfo>;
}

/** Состояние свойства сущности. */
export interface IPropertyState {
  /** Название свойства. */
  Name: string;
  /** Признак доступности свойства. */
  IsEnabled: boolean;
  /** Признак обязательности свойства. */
  IsRequired: boolean;
  /** Признак видимости свойства. */
  IsVisible: boolean;
}

/** Информация о состоянии сущности. */
export interface IEntityState {
  /** Признак доступности сущности для редактирования. */
  IsEnabled: boolean;
  /** Состояние свойств. */
  Properties: Array<IPropertyState>;
}

/** Информация о блокировке сущности. */
export interface ILockInfo {
  /** Признак, что сущность заблокирована. */
  IsLocked: boolean;
  /** Признак, что сущность заблокирована текущим клиентом. */
  IsLockedByMe: boolean;
  /** Признак, что сущность заблокирована в текущем контексте. */
  IsLockedHere: boolean;
  /** Время установки блокировки. */
  LockTime: Date;
  /** Имя пользователя, который установил блокировку. */
  OwnerName: string;
}

/** Сущность. */
export interface IEntity {
  /** Идентификатор сущности. */
  Id: number;
  /** Отображаемое значение. */
  DisplayValue: string;
  /** Информация о сущности. */
  Info: IEntityInfo;
  /** Информация о блокировке сущности. */
  LockInfo: ILockInfo | null;
  /** Состояние сущности. */
  State: IEntityState;
  /**
   * Изменить свойство.
   * @param propertyName Название свойства.
   * @param newValue Новое значение свойства.
   */
  changeProperty(propertyName: string, newValue: Object): Promise<void>;
}

/** Дочерняя сущность. */
export interface IChildEntity<TRoot extends IEntity> extends IEntity {
  /** Родительская сущность. */
  RootEntity: TRoot;
}

/** Коллекция дочерних сущностей. */
export interface IChildEntityCollection<TRoot extends IEntity, TItem extends IChildEntity<TRoot>> {
  /** Количество элементов коллекции. */
  length: number;
  /**
   * Создать и добавить дочернюю сущность в коллекцию.
   * @returns Добавленная дочерняя сущность.
   */
  addNew(): Promise<TItem>;
  /**
   * Удалить из коллекции дочернюю сущность.
   * @param childEntity Дочерняя сущность.
   */
  remove(childEntity: TItem): Promise<void>;
  /**
   * Выполнить указанный callback для каждого элемента коллекции.
   * @param callback Callback.
   */
  forEach(callback: (item: TItem, index: number, collection: IChildEntityCollection<TRoot, TItem>) => void): void;
  /**
   * Выполнить фильтрацию коллекции с помощью указанного предиката.
   * @param predicate Предикат.
   * @returns Массив с отфильтрованными дочерними сущностями.
   */
  filter(predicate: (item: TItem, index: number, collection: IChildEntityCollection<TRoot, TItem>) => boolean): Array<TItem>;
  /**
   * Найти элемент с помощью указанного предиката.
   * @param predicate Предикат.
   * @returns Первый найденный элемент, либо undefined.
   */
  find(predicate: (item: TItem, index: number, collection: IChildEntityCollection<TRoot, TItem>) => void): TItem | undefined;
  /**
   * Выполнить указанный callback для каждого элемента коллекции и вернуть массив, содержащий результат.
   * @param callback Callback.
   * @returns Массив с результатами выполнения callback'а.
   */
  map<T>(callback: (item: TItem, index: number, collection: IChildEntityCollection<TRoot, TItem>) => T): Array<T>;
  /**
   * Отсортировать коллекцию с помощью указанной функции сравнения.
   * @param compareFunction Функция сравнения.
   * @returns Массив с отсортированными дочерними сущностями.
   */
  sort(compareFunction: (a: TItem, b: TItem) => number): Array<TItem>;
}

/** API сторонних компонентов. */
export interface IRemoteComponentApiBase {
}

/** Поддерживаемые хостом области загрузки стороннего контрола. */
export enum RuntimeScope {
  Card = 'Card',
  Cover = 'Cover'
}

/** Параметры стороннего контрола. */
export interface IRemoteControlInfo {
  /** Имя связанного с контролом свойства сущности. */
  propertyName?: string;
}

/** Колбек для очистки при размонтировании контрола. */
export type ControlCleanupCallback = () => void;

/** Аргументы загрузчика контрола. */
export interface ILoaderArgsBase {
}

/** Загрузчик контрола. */
export interface IRemoteControlLoader {
  default(args: ILoaderArgsBase): Promise<ControlCleanupCallback>;
}

/** Метаданные загрузчика контрола. */
export interface IRemoteControlLoaderMetadata {
  /** Название загрузчика. */
  name: string;
  /** Контекст времени выполнения. */
  scope: RuntimeScope;
}

/** Метаданные стороннего контрола. */
export interface IRemoteControlMetadata {
  /** Идентификатор контрола. */
  id: Guid;
  /** Имя контрола. */
  name: string;
  /** Имена загрузчиков контрола. */
  loaders: Array<IRemoteControlLoaderMetadata>;
}

/** Манифест стороннего компонента. */
export interface IRemoteComponentMetadata {
  /** Имя вендора. */
  vendorName: string;
  /** Название компонента. */
  componentName: string;
  /** Версия компонента. */
  componentVersion: string;
  /** Контролы стороннего компонента. */
  controls: Array<IRemoteControlMetadata>;
  /** Используемая версия апи хоста. */
  hostApiVersion?: string;
}

/** Значение для свойства типа Перечисление. */
export interface IEnumPropertyValue {
  /** Значение перечисления. */
  Value: string;
  /** Отображаемое значение. */
  DisplayValue: string;
}

/** Значение для свойства типа Ссылка. */
export interface INavigationPropertyValue {
  /** Идентификатор сущности. */
  Value: number;
  /** Отображаемое значение. */
  DisplayValue: string;
}
