import { CssSelector, SelectorMatcher } from './selector';
import { ClassType, Visitor, createComponentView, ViewData } from 'mojiito-core';
import { WrappedError } from './facade/error';
import { stringify } from './facade/lang';
import { ListWrapper } from './facade/collection';
import { CompileComponentSummary } from './compiler/compile_result';

export class DomVisitor implements Visitor {

  private _selectorMatcher = new SelectorMatcher();
  private _componentsIndex = new Map<CompileComponentSummary, number>();

  constructor(components: CompileComponentSummary[]) {
    components.forEach((component, index) => {
      this._selectorMatcher.addSelectables(component.selector, component);
      this._componentsIndex.set(component, index);
    });
  }

  visitElement(element: Element, parentView: ViewData): any {
    const elementCssSelector = CssSelector.fromElement(element);
    let matchingComponent: CompileComponentSummary;
    this._selectorMatcher.match(elementCssSelector, (selector, component) => {
      if (matchingComponent) {
        throw new MultipleComponentsOnElementError([matchingComponent.type, component.type]);
      }
      matchingComponent = component;
    });

    // if no matching component return current context
    if (!matchingComponent) {
      return parentView;
    }
    // console.log(`Found ${stringify(matchingComponent.type)} on element:`, element);

    const viewDef = matchingComponent.viewDefinitionFactory();
    const view = createComponentView(parentView, viewDef, element);

    // console.log(`Created ${stringify(matchingComponent.type)} ` +
    //   `with parent ${stringify(parentView.component)}`);

    // ListWrapper.forEach(element.attributes, attr => {

    // });

    return view;
  }

  visitAttribute(element: Element, attr: Attr, context: any) { }
  visitText(text: Text, context: any) { }
  visitComment(comment: Comment, context: any) { }

}

export class ParseError extends WrappedError {
  constructor(error: any) {
    super(`Parse Error`, error);
  }
}

export class MultipleComponentsOnElementError extends ParseError {
  constructor(components: ClassType<any>[]) {
    const names = components.map(c => stringify(c)).join(', ');
    super(`The selectors of the components ${names} are matching the same DOM Element. ` +
      `Only one component per element is allowed.`);
  }
}
