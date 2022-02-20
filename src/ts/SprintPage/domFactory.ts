type IDOMNodeConstructor = {
  parentElement?: any;
  tagName?: string;
  className?: string;
  nodeContent?: string;
  useTemplate?: string;
};

export default function domFactory(init?: IDOMNodeConstructor) {
  const templateConverter = (htmlString: string) => {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    return template.content.cloneNode(true);
  };

  const construct = (params: IDOMNodeConstructor) => {
    const el = document.createElement(params?.tagName || 'div');
    el.className = params?.className || '';
    el.textContent = params?.nodeContent || '';

    if (params?.useTemplate) {
      const constructedMarkup = templateConverter(
        params.useTemplate,
      ) as HTMLElement;
      el.appendChild(constructedMarkup);
    }

    if (params?.parentElement) {
      params?.parentElement?.appendChild(el);
    }

    return el;
  };

  return construct(init);
}
