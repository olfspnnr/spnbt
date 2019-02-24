const domParser = require("html-dom-parser");

export interface DomElement {
  [key: string]: string | DomElement | DomAttributes | DomElement[];
  data: string;
  type: string;
  next: DomElement;
  prev: DomElement;
  parent: DomElement;
  attribs: DomAttributes;
  children: DomElement[];
}

interface DomAttributes {
  [key: string]: string;
  class?: string;
  id?: string;
  href?: string;
  target?: string;
  rel?: string;
  src?: string;
}

export class Parser {
  constructor() {}

  public parse(inputText: string) {
    return domParser(inputText);
  }

  public findInDomElements(
    arrayOfChildren: DomElement[],
    attribName: string,
    stringToFind: string,
    foundElements: DomElement[]
  ) {
    arrayOfChildren.map((element, idx) => {
      if (element.attribs && element.attribs[attribName] !== undefined) {
        if (
          !!~element.attribs[attribName]
            .toLocaleLowerCase()
            .indexOf(stringToFind.toLocaleLowerCase())
        ) {
          console.log("success");
          foundElements.push(element);
          return element;
        } else if (
          element.children &&
          element.children.length !== undefined &&
          element.children.length > 0
        ) {
          this.findInDomElements(element.children, attribName, stringToFind, foundElements);
        }
      } else if (
        element[attribName] !== undefined &&
        typeof element[attribName] === "string" &&
        !!~(element[attribName] as string)
          .toLocaleLowerCase()
          .indexOf(stringToFind.toLocaleLowerCase())
      ) {
        foundElements.push(element);
        return element;
      } else {
        if (
          element.children &&
          element.children.length !== undefined &&
          element.children.length > 0
        ) {
          this.findInDomElements(element.children, attribName, stringToFind, foundElements);
        }
      }
    });
  }
}
