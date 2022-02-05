export function addElement(base: Element, nameTag: string, ...nameClass: string[]) {
  const element = document.createElement(nameTag);
  element.classList.add(...nameClass);
  base.append(element);
  return element;
}
// nameTemplate = .className | #idName
export function addFragment(base: Element, nameTemplate: string) {
  const template: HTMLTemplateElement = document.querySelector(nameTemplate);
  base.appendChild(template.content.cloneNode(true));
}
