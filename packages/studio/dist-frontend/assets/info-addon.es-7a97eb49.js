import{C as r}from"./codemirror.es-90de9cf3.js";import"./index-f23b6703.js";var y=Object.defineProperty,u=(e,t)=>y(e,"name",{value:t,configurable:!0});r.defineOption("info",!1,(e,t,n)=>{if(n&&n!==r.Init){const o=e.state.info.onMouseOver;r.off(e.getWrapperElement(),"mouseover",o),clearTimeout(e.state.info.hoverTimeout),delete e.state.info}if(t){const o=e.state.info=d(t);o.onMouseOver=T.bind(null,e),r.on(e.getWrapperElement(),"mouseover",o.onMouseOver)}});function d(e){return{options:e instanceof Function?{render:e}:e===!0?{}:e}}u(d,"createState");function g(e){const{options:t}=e.state.info;return(t==null?void 0:t.hoverTime)||500}u(g,"getHoverTime");function T(e,t){const n=e.state.info,o=t.target||t.srcElement;if(!(o instanceof HTMLElement)||o.nodeName!=="SPAN"||n.hoverTimeout!==void 0)return;const s=o.getBoundingClientRect(),i=u(function(){clearTimeout(n.hoverTimeout),n.hoverTimeout=setTimeout(f,a)},"onMouseMove"),p=u(function(){r.off(document,"mousemove",i),r.off(e.getWrapperElement(),"mouseout",p),clearTimeout(n.hoverTimeout),n.hoverTimeout=void 0},"onMouseOut"),f=u(function(){r.off(document,"mousemove",i),r.off(e.getWrapperElement(),"mouseout",p),n.hoverTimeout=void 0,h(e,s)},"onHover"),a=g(e);n.hoverTimeout=setTimeout(f,a),r.on(document,"mousemove",i),r.on(e.getWrapperElement(),"mouseout",p)}u(T,"onMouseOver");function h(e,t){const n=e.coordsChar({left:(t.left+t.right)/2,top:(t.top+t.bottom)/2}),o=e.state.info,{options:s}=o,i=s.render||e.getHelper(n,"info");if(i){const p=e.getTokenAt(n,!0);if(p){const f=i(p,s,e,n);f&&M(e,t,f)}}}u(h,"onMouseHover");function M(e,t,n){const o=document.createElement("div");o.className="CodeMirror-info",o.append(n),document.body.append(o);const s=o.getBoundingClientRect(),i=window.getComputedStyle(o),p=s.right-s.left+parseFloat(i.marginLeft)+parseFloat(i.marginRight),f=s.bottom-s.top+parseFloat(i.marginTop)+parseFloat(i.marginBottom);let a=t.bottom;f>window.innerHeight-t.bottom-15&&t.top>window.innerHeight-t.bottom&&(a=t.top-f),a<0&&(a=t.bottom);let l=Math.max(0,window.innerWidth-p-15);l>t.left&&(l=t.left),o.style.opacity="1",o.style.top=a+"px",o.style.left=l+"px";let c;const v=u(function(){clearTimeout(c)},"onMouseOverPopup"),m=u(function(){clearTimeout(c),c=setTimeout(O,200)},"onMouseOut"),O=u(function(){r.off(o,"mouseover",v),r.off(o,"mouseout",m),r.off(e.getWrapperElement(),"mouseout",m),o.style.opacity?(o.style.opacity="0",setTimeout(()=>{o.parentNode&&o.remove()},600)):o.parentNode&&o.remove()},"hidePopup");r.on(o,"mouseover",v),r.on(o,"mouseout",m),r.on(e.getWrapperElement(),"mouseout",m)}u(M,"showPopup");
