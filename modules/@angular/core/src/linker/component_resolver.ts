import {Type, isBlank, stringify} from '@angular/facade/lang';
import {BaseException} from '@angular/facade/exceptions';
import {PromiseWrapper} from '@angular/facade/async';
import {reflector} from '../reflection/reflection';
import {ComponentFactory} from './component_factory';
import {Injectable} from '../di/decorators';

/**
 * Low-level service for loading {@link ComponentFactory}s, which
 * can later be used to create and render a Component instance.
 */
export abstract class ComponentResolver {
  abstract resolveComponent(componentType: Type): Promise<ComponentFactory>;
  abstract clearCache();
}

function _isComponentFactory(type: any): boolean {
  return type instanceof ComponentFactory;
}

@Injectable()
export class ReflectorComponentResolver extends ComponentResolver {
  resolveComponent(componentType: Type): Promise<ComponentFactory> {
    var metadatas = reflector.annotations(componentType);
    var componentFactory = metadatas.find(_isComponentFactory);

    if (isBlank(componentFactory)) {
      throw new BaseException(`No precompiled component ${stringify(componentType)} found`);
    }
    return PromiseWrapper.resolve(componentFactory);
  }
  clearCache() {}
}
