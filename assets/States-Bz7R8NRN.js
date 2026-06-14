import{d as h,o as i,c,a as e,h as s,b as a,w as d,i as g,v as _,F as v,r as k,n as b,f as m,g as C}from"./index-BBLEVyl-.js";import{_ as u,F as w,p as y}from"./DemoCard.vue_vue_type_script_setup_true_lang-DuLwJFOE.js";import{_ as M}from"./ColorField.vue_vue_type_script_setup_true_lang-DaHNsndR.js";import{S}from"./Swatch-D1i3NoVa.js";const V={class:"controls"},x={class:"field"},H={class:"grid"},R=h({__name:"States",setup(T){const r=m("#2563eb"),n=m("light"),f=["default","hover","active","disabled","focus","selected"],l=C(()=>new w([{name:"t",colorMode:n.value,palette:[r.value],colorMap:{}}]).getColors("demo"));return(p,t)=>(i(),c(v,null,[t[5]||(t[5]=e("h1",null,"State Colors",-1)),t[6]||(t[6]=e("p",{class:"lead"},[s(" For every base color, "),e("code",null,"getColors(key)"),s(" derives "),e("code",null,"default / hover / active / disabled / focus / selected"),s(". Defaults are "),e("strong",null,"colorMode‑aware"),s(" — dark mode lightens hover more and darkens active less. Provide a "),e("code",null,"stateRecipe"),s(" to fully customize them. ")],-1)),a(u,{title:"The six states",desc:"Pick a base color and a color mode to see the derived states."},{default:d(()=>[e("div",V,[a(M,{modelValue:r.value,"onUpdate:modelValue":t[0]||(t[0]=o=>r.value=o),label:"Base color"},null,8,["modelValue"]),e("label",x,[t[3]||(t[3]=e("span",{class:"field__label"},"colorMode",-1)),g(e("select",{"onUpdate:modelValue":t[1]||(t[1]=o=>n.value=o)},[...t[2]||(t[2]=[e("option",{value:"light"},"light",-1),e("option",{value:"dark"},"dark",-1)])],512),[[_,n.value]])])]),e("div",H,[(i(),c(v,null,k(f,o=>a(S,{key:o,color:l.value[o],label:o},null,8,["color","label"])),64))])]),_:1}),a(u,{title:"Live button",desc:"A real button wired to the derived states — hover and press it to feel the result."},{default:d(()=>[e("button",{class:"state-btn",style:b({"--c-default":l.value.default,"--c-hover":l.value.hover,"--c-active":l.value.active,color:"#fff"})}," Hover & click me ",4),e("button",{class:"state-btn",disabled:"",style:b({background:l.value.disabled,color:"#fff"})}," Disabled ",4)]),_:1}),a(u,{title:"Usage"},{default:d(()=>[...t[4]||(t[4]=[e("pre",null,[e("code",null,`import { ColorHub, lighten, darken } from '@bndynet/color-hub';

const hub = new ColorHub([
  { name: 'light', colorMode: 'light', palette: ['#2563eb'], colorMap: {} },
]);

const s = hub.getColors('primary');
s.default; s.hover; s.active; s.disabled; s.focus; s.selected;

// Customize via a stateRecipe (hub-level or per-theme):
new ColorHub(themes, {
  stateRecipe: {
    hover: (base, hub) =>
      hub.getCurrentTheme().colorMode === 'dark'
        ? darken(base, 0.08)
        : lighten(base, 0.12),
  },
});`)],-1)])]),_:1})],64))}}),E=y(R,[["__scopeId","data-v-00f26796"]]);export{E as default};
