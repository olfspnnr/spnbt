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
  name?: string;
}

interface DomAttributes {
  [key: string]: string;
  class?: string;
  id?: string;
  href?: string;
  target?: string;
  rel?: string;
  src?: string;
  datetime?: string;
  title?: string;
}

export enum DomAttributeNames {
  class = "class",
  id = "id",
  href = "href",
  target = "target",
  rel = "rel",
  src = "src",
  datetime = "datetime",
  title = "title",
  data = "data",
  type = "type",
  next = "next",
  prev = "prev",
  parent = "parent",
  attribs = "attribs",
  children = "children",
  name = "name"
}

export class Parser {
  constructor() {}

  public parse(inputText: string) {
    return domParser(inputText);
  }

  public getElementAsObject = (Element: DomElement, filterBy: "class") => {
    try {
      const getDeep = (domElement: DomElement) => {
        let newElement: any = {};
        if (
          domElement[DomAttributeNames.attribs] &&
          domElement[DomAttributeNames.attribs][filterBy]
        ) {
          newElement = {
            [[domElement[DomAttributeNames.attribs][filterBy] as string][0]]: domElement
          };
        } else {
          newElement = {
            [domElement[DomAttributeNames.name]]: domElement || undefined
          };
        }
        if (domElement.children) {
          domElement.children.map(element => {
            if (
              element[DomAttributeNames.attribs] !== undefined &&
              element[DomAttributeNames.attribs][filterBy] !== undefined &&
              element[DomAttributeNames.attribs][filterBy][0] !== undefined &&
              element[DomAttributeNames.attribs][filterBy][0] !== ""
            ) {
              newElement[[element[DomAttributeNames.attribs][filterBy] as string][0]] = undefined;
              if (element) {
                newElement[[element[DomAttributeNames.attribs][filterBy] as string][0]] = element;
              }
              if (element.children) {
                element.children.map(child => {
                  newElement = { ...newElement, ...getDeep(child) };
                });
              }
            }
          });
        }
        return newElement;
      };
      let returnElement = { [Element[filterBy] as string]: Element || undefined } as any;
      if (Element.children) {
        Element.children.map(child => {
          returnElement = { ...returnElement, ...getDeep(child) };
        });
      }

      return returnElement;
    } catch (error) {
      console.log({ caller: "getElementAsObject", error: error });
    }
  };

  public findInDomElements(
    arrayOfChildren: DomElement[],
    attribName: DomAttributeNames,
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
