import {paramsKey, scopeKey, ScopeOption} from "./model";
import 'reflect-metadata';

export abstract class DIContainer {
  abstract resolve<T>(target: new (...args: any[]) => T): T | undefined;

  protected createInstance<T>(target: new (...args: unknown[]) => T): T {
    const paramTypes: unknown[] = Reflect.getMetadata(paramsKey, target) || [];

    const injections: unknown[] = paramTypes.map(((deps: any) => this.resolve(deps)));

    return new target(...injections);
  }
}

/**
 * Dependency Injection Container
 * Root定義されているクラスはシングルトン
 */
export class RootContainer extends DIContainer {
  private rootContainer = new Map<Function, unknown>();

  resolve<T>(target: new (...args: any[]) => T): T | undefined {

    const scope = Reflect.getMetadata(scopeKey, target) as ScopeOption;

    if (scope === 'root') {
      if (this.rootContainer.has(target)) {

        return this.rootContainer.get(target) as T;
      }

      const instance: T = this.createInstance(target);

      this.rootContainer.set(target, instance);

      return instance;
    }

    return undefined;
  }
}

/**
 * Dependency Injection Container
 * fn定義されているクラスは毎回新しいインスタンスを生成する
 */
export class FnContainer extends DIContainer {
  private fnContainer = new Map<Function, unknown>();

  resolve<T>(target: new (...args: any[]) => T): T | undefined {

    const scope = Reflect.getMetadata(scopeKey, target) as ScopeOption;

    if (scope === 'fn') {
      if (this.fnContainer.has(target)) {
        return this.fnContainer.get(target) as T;
      }

      const instance: T = this.createInstance(target);
      this.fnContainer.set(target, instance);

      return instance;
    }

    return undefined;
  }
}