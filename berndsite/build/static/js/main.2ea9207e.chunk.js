(this.webpackJsonptest=this.webpackJsonptest||[]).push([[0],{22:function(e,t,a){e.exports=a(36)},27:function(e,t,a){},28:function(e,t,a){},36:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),s=a(19),r=a.n(s),c=(a(27),a(7)),o=a(8),i=a(10),u=a(9),m=(a(28),a(2)),f=a(11),d=a(20),h=function(e){return n.createElement("div",{className:"flex flex-grow-0 w-full h-10 px-2 justify-center items-center bg-".concat(e.colors.primary,"-500 shadow z-10")},n.createElement("div",{className:"flex justify-center items-center h-full w-full container"},n.createElement("div",{className:"flex flex-1 h-full w-full items-center items-center justify-center text-".concat(e.colors.textOnColor," font-light text-md bg-").concat(e.colors.primary,"-900")},e.title),n.createElement("div",{className:"w-4 h-full"}),n.createElement("div",{className:"flex flex-1 h-full w-full items-center content-start",style:{flex:8}},e.children)))},x=function(e){var t={transition:"all 200ms"};return n.createElement("div",{className:"flex h-full justify-center items-center text-".concat(e.colors.primary,"-300 ").concat(e.className),style:t},n.createElement(d.a,{exact:void 0!==e.exact&&e.exact,activeClassName:"bg-".concat(e.colors.primary,"-700 text-").concat(e.colors.textOnColor),className:"flex justify-center items-center h-full w-full text-sm hover:text-".concat(e.colors.textOnColor," px-6 hover:underline"),style:Object(f.a)(Object(f.a)({},t),e.style),to:e.to},e.children))},g=function(e){Object(i.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={},n}return Object(o.a)(a,[{key:"render",value:function(){return n.createElement("div",{className:"flex w-full h-full justify-center items-center"},n.createElement("div",{className:"flex flex-1"},"."),n.createElement("div",{className:"flex flex-col bg-blue-700 border content-start shadow-lg overflow-hidden",style:{height:"600px",width:"400px"}},n.createElement("div",{className:"flex flex-grow-0 h-16 justify-center items-end bg-gray-100 text-xl font-light z-10 text-gray-700 border-b pb-2"},n.createElement("span",{className:"flex flex-col flex-1 pl-2 text-base font-light text-gray-600"},n.createElement("span",{className:"px-2 hover:underline pointer-cursor text-blue-600"},"\xdcbung 4")),n.createElement("span",{className:"flex flex-1 items-center justify-center"},"Example Name"),n.createElement("span",{className:"flex flex-1 justify-end pr-2 text-base font-light text-gray-600"},n.createElement("span",{className:"px-2 hover:underline pointer-cursor text-blue-600"},"Deutsch"))),n.createElement("div",{className:"flex flex-col w-full content-start z-10 bg-gray-100",style:{flex:3}},n.createElement("div",{className:"flex w-full h-5 "},[!0,!0,!0,!1,!1,!1,!1,!1,!1,!1].map((function(e){return n.createElement("div",{className:"flex flex-1 bg-white cursor-pointer ".concat(e?"bg-blue-300 border-blue-200 hover:bg-blue-400":"bg-gray-200 border-gray-400 shadow-inner hover:shadow-none hover:bg-gray-300","  border-r"),style:{transition:"all 150ms"}})}))),n.createElement("div",{className:"flex flex-1 text-normal font-light"},n.createElement("div",{className:"p-4 pt-4 w-full h-full border-b border-t bg-gray-200"},n.createElement("div",{className:"flex flex-col w-full h-full bg-white shadow-lg rounded-lg"},n.createElement("div",{className:"flex items-center pl-3 pt-1 h-10 border-b text-lg font-light text-blue-600"},"Markiere den Hauptsatz"),n.createElement("div",{className:"p-3 px-4 flex flex-1"},n.createElement("div",{className:"w-full h-full"},n.createElement("span",{className:" hover:bg-blue-200 cursor-pointer",style:{transition:"all 200ms"}},"Dies ist ein Beispielsatz"),",",n.createElement("span",{className:" hover:bg-blue-200 cursor-pointer",style:{transition:"all 200ms"}}," ","der zum Lernen f\xfcr Syntax\xfcbungen w\xe4hrend des Germanistikstudiums"),",",n.createElement("span",{className:" hover:bg-blue-200 cursor-pointer",style:{transition:"all 200ms"}}," ","in der Universit\xe4t"),",",n.createElement("span",{className:" hover:bg-blue-200 cursor-pointer",style:{transition:"all 200ms"}}," ","genutzt werden kann."))),n.createElement("div",{className:"px-3 py-1 flex border-t text-xs font-light text-gray-600"},n.createElement("span",{className:"flex flex-1"},"\xdcbung 4.4"),n.createElement("span",{className:"flex flex-1 justify-center"},"sp\xe4ter bearbeiten"),n.createElement("span",{className:"flex flex-1 ml-auto justify-end"},"Hilfe"))))))),n.createElement("div",{className:"flex flex-1"},"."))}}]),a}(n.Component),b=function(e){Object(i.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).handleOnClick=function(){n.setState((function(e){var t=e.clicks+1;return{clicks:666===t?667:t}}))},n.handleMessageSend=function(){n.state.websocket&&n.setState((function(e){if(e.websocket){var t=JSON.stringify({type:"sendMessage",payLoad:e.message+""});console.log(t),e.websocket.send(t)}return Object(f.a)(Object(f.a)({},e),{},{message:null})}))},n.handleMessage=function(e){if(e&&e.target){var t=e.target.value;n.setState({message:t})}},n.state={clicks:660,message:null,websocket:null},n}return Object(o.a)(a,[{key:"componentDidMount",value:function(){var e=this,t=new WebSocket("ws://".concat(window.location.host,":8080"));t.addEventListener("open",(function(a){console.log("test"),e.setState((function(e){return Object(f.a)(Object(f.a)({},e),{},{websocket:t})}))})),t.addEventListener("message",(function(e){console.log(e.data)}))}},{key:"render",value:function(){var e=this;return n.createElement("div",{className:"flex flex-col w-full h-full justify-center items-center"},n.createElement("span",null,"Chat"),n.createElement("span",{className:"cursor-pointer text-5xl text-gray-700 select-none",onClick:function(){return e.handleOnClick()}},this.state.clicks),n.createElement("input",{type:"text",value:this.state.message||"",onChange:this.handleMessage}),n.createElement("button",{onClick:this.handleMessageSend},"send"))}}]),a}(n.Component),v=function(e){Object(i.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={colors:{primary:"orange",secondary:"yellow",tertiary:"teal",textOnColor:"white",textDefault:"black",textHighlight:"purple"}},n}return Object(o.a)(a,[{key:"componentDidMount",value:function(){this.setState({})}},{key:"render",value:function(){var e=this;return n.createElement("div",{className:"flex flex-col flex-1 w-full h-full"},n.createElement(h,{title:"Bernds Page",key:"AppNavBar",colors:this.state.colors},n.createElement(x,{exact:!0,colors:this.state.colors,to:"/"},"Home"),n.createElement(x,{colors:this.state.colors,to:"/Chat/"},"Chat"),n.createElement(x,{colors:this.state.colors,to:"/Table/"},"Table")),n.createElement("div",{className:"flex flex-1 w-full h-full justify-center items-center bg-gray-100"},n.createElement("div",{className:"flex justify-center items-center w-full h-full container"},n.createElement(m.c,{location:this.props.RouteProps.location},n.createElement(m.a,{exact:!0,path:"/",render:function(t){return n.createElement(g,e.state)}}),n.createElement(m.a,{path:"/Chat/",render:function(t){return n.createElement(b,e.state)}})))))}}]),a}(n.Component),p=function(e){Object(i.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).initialLoadingMessage=void 0,n.initialLoadingMessage="Loading",n.state={isLoading:!0,loadingMessage:n.initialLoadingMessage,num:n.initialLoadingMessage.length},n}return Object(o.a)(a,[{key:"componentDidMount",value:function(){var e=this,t=setInterval((function(){console.log("test"),e.setState({loadingMessage:"Loading".padEnd(e.state.num,"."),num:e.state.num===e.initialLoadingMessage.length+3?e.initialLoadingMessage.length:e.state.num+1})}),450);this.setState({isLoading:!1},(function(){clearInterval(t)}))}},{key:"render",value:function(){return l.a.createElement("div",{className:"flex flex-1 flex-col w-full h-full"},this.state.isLoading?l.a.createElement("div",{className:"flex w-full h-full justify-center items-center bg-blue-100 text-3xl"},this.state.loadingMessage):l.a.createElement(m.a,{render:function(e){return l.a.createElement(v,{RouteProps:e})}}))}}]),a}(l.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var y=a(4),E=Object(y.a)();r.a.render(l.a.createElement(m.b,{history:E},l.a.createElement(p,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[22,1,2]]]);
//# sourceMappingURL=main.2ea9207e.chunk.js.map