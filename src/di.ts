import {scopeKey, ScopeOption} from "./model";
import "reflect-metadata";
import {FnContainer, RootContainer} from "./di-container";

const rootContainer = new RootContainer();

const fnContainer = new FnContainer();

export function Inject<T>(target: new (...args: any[]) => T): T {

  // fnで探索する
  const fnInstance = fnContainer.resolve(target);

  if (typeof fnInstance !== 'undefined') {
    return fnInstance
  }

  // rootで探索する
  const rootInstance = rootContainer.resolve(target);
  if (typeof rootInstance !== 'undefined') {
    return rootInstance
  }

  throw new Error(`${target} not found`);
}


export function Scope({scope}: { scope: ScopeOption }) {
  return function (target: any): void {
    Reflect.defineMetadata(scopeKey, scope, target);
  };
}