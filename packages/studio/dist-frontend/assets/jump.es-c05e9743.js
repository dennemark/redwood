import{C as u}from"./codemirror.es-90de9cf3.js";import{g as M,a as j,b as k,c as y,d as v,e as O}from"./SchemaReference.es-7ed8c842.js";import"./index-f23b6703.js";import"./forEachState.es-1e367fb2.js";var D=Object.defineProperty,s=(e,n)=>D(e,"name",{value:n,configurable:!0});u.defineOption("jump",!1,(e,n,r)=>{if(r&&r!==u.Init){const t=e.state.jump.onMouseOver;u.off(e.getWrapperElement(),"mouseover",t);const i=e.state.jump.onMouseOut;u.off(e.getWrapperElement(),"mouseout",i),u.off(document,"keydown",e.state.jump.onKeyDown),delete e.state.jump}if(n){const t=e.state.jump={options:n,onMouseOver:l.bind(null,e),onMouseOut:m.bind(null,e),onKeyDown:c.bind(null,e)};u.on(e.getWrapperElement(),"mouseover",t.onMouseOver),u.on(e.getWrapperElement(),"mouseout",t.onMouseOut),u.on(document,"keydown",t.onKeyDown)}});function l(e,n){const r=n.target||n.srcElement;if(!(r instanceof HTMLElement)||(r==null?void 0:r.nodeName)!=="SPAN")return;const t=r.getBoundingClientRect(),i={left:(t.left+t.right)/2,top:(t.top+t.bottom)/2};e.state.jump.cursor=i,e.state.jump.isHoldingModifier&&p(e)}s(l,"onMouseOver");function m(e){if(!e.state.jump.isHoldingModifier&&e.state.jump.cursor){e.state.jump.cursor=null;return}e.state.jump.isHoldingModifier&&e.state.jump.marker&&d(e)}s(m,"onMouseOut");function c(e,n){if(e.state.jump.isHoldingModifier||!g(n.key))return;e.state.jump.isHoldingModifier=!0,e.state.jump.cursor&&p(e);const r=s(o=>{o.code===n.code&&(e.state.jump.isHoldingModifier=!1,e.state.jump.marker&&d(e),u.off(document,"keyup",r),u.off(document,"click",t),e.off("mousedown",i))},"onKeyUp"),t=s(o=>{const{destination:a,options:f}=e.state.jump;a&&f.onClick(a,o)},"onClick"),i=s((o,a)=>{e.state.jump.destination&&(a.codemirrorIgnore=!0)},"onMouseDown");u.on(document,"keyup",r),u.on(document,"click",t),e.on("mousedown",i)}s(c,"onKeyDown");const b=typeof navigator<"u"&&navigator&&navigator.appVersion.includes("Mac");function g(e){return e===(b?"Meta":"Control")}s(g,"isJumpModifier");function p(e){if(e.state.jump.marker)return;const{cursor:n,options:r}=e.state.jump,t=e.coordsChar(n),i=e.getTokenAt(t,!0),o=r.getDestination||e.getHelper(t,"jump");if(o){const a=o(i,r,e);if(a){const f=e.markText({line:t.line,ch:i.start},{line:t.line,ch:i.end},{className:"CodeMirror-jump-token"});e.state.jump.marker=f,e.state.jump.destination=a}}}s(p,"enableJumpMode");function d(e){const{marker:n}=e.state.jump;e.state.jump.marker=null,e.state.jump.destination=null,n.clear()}s(d,"disableJumpMode");u.registerHelper("jump","graphql",(e,n)=>{if(!n.schema||!n.onClick||!e.state)return;const{state:r}=e,{kind:t,step:i}=r,o=M(n.schema,r);if(t==="Field"&&i===0&&o.fieldDef||t==="AliasedField"&&i===2&&o.fieldDef)return j(o);if(t==="Directive"&&i===1&&o.directiveDef)return k(o);if(t==="Argument"&&i===0&&o.argDef)return y(o);if(t==="EnumValue"&&o.enumValue)return v(o);if(t==="NamedType"&&o.type)return O(o)});
