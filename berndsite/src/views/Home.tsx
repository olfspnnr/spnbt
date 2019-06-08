import * as React from "react";

export interface HomeProps {}

export interface HomeState {}

export class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-1">.</div>
        <div
          className="flex flex-col bg-blue-700 border content-start shadow-lg overflow-hidden"
          style={{ height: "600px", width: "400px" }}
        >
          <div className="flex flex-grow-0 h-16 justify-center items-end bg-gray-100 text-xl font-light z-10 text-gray-700 border-b pb-2">
            <span className="flex flex-col flex-1 pl-2 text-base font-light text-gray-600">
              <span className="px-2 hover:underline pointer-cursor text-blue-600">Übung 4</span>
            </span>
            <span className="flex flex-1 items-center justify-center">Example Name</span>
            <span className="flex flex-1 justify-end pr-2 text-base font-light text-gray-600">
              <span className="px-2 hover:underline pointer-cursor text-blue-600">Deutsch</span>
            </span>
          </div>
          <div className="flex flex-col w-full content-start z-10 bg-gray-100" style={{ flex: 3 }}>
            <div className="flex w-full h-5 ">
              {[true, true, true, false, false, false, false, false, false, false].map(bool => (
                <div
                  className={`flex flex-1 bg-white cursor-pointer ${
                    bool
                      ? "bg-blue-300 border-blue-200 hover:bg-blue-400"
                      : "bg-gray-200 border-gray-400 shadow-inner hover:shadow-none hover:bg-gray-300"
                  }  border-r`}
                  style={{ transition: "all 150ms" }}
                />
              ))}
            </div>

            <div className="flex flex-1 text-normal font-light">
              <div className="p-4 pt-4 w-full h-full border-b border-t bg-gray-200">
                <div className="flex flex-col w-full h-full bg-white shadow-lg rounded-lg">
                  <div className="flex items-center pl-3 pt-1 h-10 border-b text-lg font-light text-blue-600">
                    Markiere den Hauptsatz
                  </div>
                  <div className="p-3 px-4 flex flex-1">
                    <div className="w-full h-full">
                      <span
                        className=" hover:bg-blue-200 cursor-pointer"
                        style={{ transition: "all 200ms" }}
                      >
                        Dies ist ein Beispielsatz
                      </span>
                      ,
                      <span
                        className=" hover:bg-blue-200 cursor-pointer"
                        style={{ transition: "all 200ms" }}
                      >
                        {" "}
                        der zum Lernen für Syntaxübungen während des Germanistikstudiums
                      </span>
                      ,
                      <span
                        className=" hover:bg-blue-200 cursor-pointer"
                        style={{ transition: "all 200ms" }}
                      >
                        {" "}
                        in der Universität
                      </span>
                      ,
                      <span
                        className=" hover:bg-blue-200 cursor-pointer"
                        style={{ transition: "all 200ms" }}
                      >
                        {" "}
                        genutzt werden kann.
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 flex border-t text-xs font-light text-gray-600">
                    <span className="flex flex-1">Übung 4.4</span>
                    <span className="flex flex-1 justify-center">später bearbeiten</span>
                    <span className="flex flex-1 ml-auto justify-end">Hilfe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-1 bg-white">
            <div className="flex flex-grow-0 w-full justify-center items-center cursor-pointer text-xl font-light">
              <div
                className="flex justify-center items-center p-6 text-5xl text-red-500 border-2 border-red-500 h-24 w-24 rounded-full hover:bg-red-300"
                style={{ lineHeight: 0, transition: "all 150ms" }}
              />
            </div>
            <div className="flex flex-grow-0 w-full justify-center items-center text-white  cursor-pointer text-xl font-light">
              <div
                className="flex justify-center items-center p-6 text-5xl text-gray-500 border-2 border-gray-500 h-24 w-24 rounded-full hover:bg-gray-300"
                style={{ lineHeight: 0, transition: "all 150ms" }}
              />
            </div>

            <div className="flex flex-grow-0 w-full justify-center items-center text-white cursor-pointer text-xl font-light">
              <div
                className="flex justify-center items-center p-6 text-5xl text-green-500 border-2 border-green-500 h-24 w-24 rounded-full hover:bg-green-300"
                style={{ lineHeight: 0, transition: "all 150ms" }}
              />
            </div>
          </div> */}
        </div>
        <div className="flex flex-1">.</div>
      </div>
    );
  }
}
