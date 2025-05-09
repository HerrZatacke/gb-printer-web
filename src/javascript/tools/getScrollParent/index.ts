export const getScrollParent = (element: Element): Element => {
  let parent = element.parentElement;

  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    const isScrollableY = (overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight;
    const isScrollableX = (overflowX === 'auto' || overflowX === 'scroll') && parent.scrollWidth > parent.clientWidth;

    if (isScrollableY || isScrollableX) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return document.scrollingElement || document.documentElement;
};
