import { fillStateProp } from "./stateController";

export const handleWebSocketMessage = (wsMessage: any) => {
  try {
    if (
      (handlePayloadType as any)[wsMessage.type] !== undefined &&
      typeof (handlePayloadType as any)[wsMessage.type] === "function"
    ) {
      (handlePayloadType as any)[wsMessage.type](wsMessage.payload);
    } else throw `could not find function for ${wsMessage.type}`;
  } catch (error) {
    console.log(error);
  }
};

const handlePayloadType = {
  loadLovoo: (payload: any) => loadLovoo(payload)
};

const loadLovoo = (payload: any) =>
  fillStateProp("lovooArray", payload)
    .then(newState => {
      console.log(newState);
    })
    .catch(error => console.log(error));
