import { AppView } from './view';
import { Renderer } from '../render';

export function subscribeToElement(view: AppView<any>, element: any,
  eventNamesAndTargets: string[], listener: (eventName: string, event: any) => any) {
  const disposables: Function[] = [];
  for (let i = 0; i < eventNamesAndTargets.length; i += 2) {
    const eventName = eventNamesAndTargets[i];
    const eventTarget = eventNamesAndTargets[i + 1];
    let disposable: Function;
    if (eventTarget) {
      disposable = view.renderer.listenGlobal(
          eventTarget, eventName, listener.bind(view, `${eventTarget}:${eventName}`));
    } else {
      disposable = view.renderer.listen(element, eventName, listener.bind(view, eventName));
    }
    disposables.push(disposable);
  }
  return () => disposables.forEach(d => d());
}
