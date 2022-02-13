export function addElement(base: Element, nameTag: string, ...nameClass: string[]) {
  const element = document.createElement(nameTag);
  element.classList.add(...nameClass);
  base.append(element);
  return element;
}
// nameTemplate = .className | #idName
export function addFragment(base: Element, idTemplate: string, template: string) {
  const templateWrapper: HTMLTemplateElement = document.createElement('template');
  templateWrapper.id = idTemplate;
  templateWrapper.innerHTML = template;
  base.appendChild(templateWrapper.content.cloneNode(true));
}
