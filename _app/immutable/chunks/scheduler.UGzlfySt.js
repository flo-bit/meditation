function N(){}const $=t=>t;function T(t,e){for(const n in e)t[n]=e[n];return t}function B(t){return t()}function tt(){return Object.create(null)}function M(t){t.forEach(B)}function H(t){return typeof t=="function"}function et(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let m;function nt(t,e){return t===e?!0:(m||(m=document.createElement("a")),m.href=e,t===m.href)}function rt(t){return Object.keys(t).length===0}function A(t,...e){if(t==null){for(const r of e)r(void 0);return N}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function it(t){let e;return A(t,n=>e=n)(),e}function ct(t,e,n){t.$$.on_destroy.push(A(e,n))}function lt(t,e,n,r){if(t){const i=j(t,e,n,r);return t[0](i)}}function j(t,e,n,r){return t[1]&&r?T(n.ctx.slice(),t[1](r(e))):n.ctx}function st(t,e,n,r){if(t[2]&&r){const i=t[2](r(n));if(e.dirty===void 0)return i;if(typeof i=="object"){const o=[],c=Math.max(e.dirty.length,i.length);for(let s=0;s<c;s+=1)o[s]=e.dirty[s]|i[s];return o}return e.dirty|i}return e.dirty}function ot(t,e,n,r,i,o){if(i){const c=j(e,n,r,o);t.p(c,i)}}function ut(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let r=0;r<n;r++)e[r]=-1;return e}return-1}function at(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function ft(t,e){const n={};e=new Set(e);for(const r in t)!e.has(r)&&r[0]!=="$"&&(n[r]=t[r]);return n}function _t(t){return t&&H(t.destroy)?t.destroy:N}let y=!1;function dt(){y=!0}function ht(){y=!1}function I(t,e,n,r){for(;t<e;){const i=t+(e-t>>1);n(i)<=r?t=i+1:e=i}return t}function L(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&l.push(a)}e=l}const n=new Int32Array(e.length+1),r=new Int32Array(e.length);n[0]=-1;let i=0;for(let l=0;l<e.length;l++){const u=e[l].claim_order,a=(i>0&&e[n[i]].claim_order<=u?i+1:I(1,i,q=>e[n[q]].claim_order,u))-1;r[l]=n[a]+1;const k=a+1;n[k]=l,i=Math.max(k,i)}const o=[],c=[];let s=e.length-1;for(let l=n[i]+1;l!=0;l=r[l-1]){for(o.push(e[l-1]);s>=l;s--)c.push(e[s]);s--}for(;s>=0;s--)c.push(e[s]);o.reverse(),c.sort((l,u)=>l.claim_order-u.claim_order);for(let l=0,u=0;l<c.length;l++){for(;u<o.length&&c[l].claim_order>=o[u].claim_order;)u++;const a=u<o.length?o[u]:null;t.insertBefore(c[l],a)}}function R(t,e){t.appendChild(e)}function z(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function mt(t){const e=C("style");return e.textContent="/* empty */",F(z(t),e),e.sheet}function F(t,e){return R(t.head||t,e),e.sheet}function U(t,e){if(y){for(L(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function pt(t,e,n){y&&!n?U(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function yt(t){t.parentNode&&t.parentNode.removeChild(t)}function bt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function C(t){return document.createElement(t)}function W(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function w(t){return document.createTextNode(t)}function gt(){return w(" ")}function xt(){return w("")}function vt(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function S(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const G=["width","height"];function wt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const r in e)e[r]==null?t.removeAttribute(r):r==="style"?t.style.cssText=e[r]:r==="__value"?t.value=t[r]=e[r]:n[r]&&n[r].set&&G.indexOf(r)===-1?t[r]=e[r]:S(t,r,e[r])}function kt(t,e){for(const n in e)S(t,n,e[n])}function Et(t){return t.dataset.svelteH}function Nt(t){return Array.from(t.childNodes)}function J(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function D(t,e,n,r,i=!1){J(t);const o=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const s=t[c];if(e(s)){const l=n(s);return l===void 0?t.splice(c,1):t[c]=l,i||(t.claim_info.last_index=c),s}}for(let c=t.claim_info.last_index-1;c>=0;c--){const s=t[c];if(e(s)){const l=n(s);return l===void 0?t.splice(c,1):t[c]=l,i?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,s}}return r()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function O(t,e,n,r){return D(t,i=>i.nodeName===e,i=>{const o=[];for(let c=0;c<i.attributes.length;c++){const s=i.attributes[c];n[s.name]||o.push(s.name)}o.forEach(c=>i.removeAttribute(c))},()=>r(e))}function At(t,e,n){return O(t,e,n,C)}function jt(t,e,n){return O(t,e,n,W)}function K(t,e){return D(t,n=>n.nodeType===3,n=>{const r=""+e;if(n.data.startsWith(r)){if(n.data.length!==r.length)return n.splitText(r.length)}else n.data=r},()=>w(e),!0)}function Ct(t){return K(t," ")}function St(t,e){e=""+e,t.data!==e&&(t.data=e)}function Dt(t,e,n,r){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,"")}function Q(t,e,{bubbles:n=!1,cancelable:r=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:r})}function Ot(t,e){return new t(e)}let p;function b(t){p=t}function d(){if(!p)throw new Error("Function called outside component initialization");return p}function Pt(t){d().$$.on_mount.push(t)}function qt(t){d().$$.after_update.push(t)}function Tt(t){d().$$.on_destroy.push(t)}function Bt(){const t=d();return(e,n,{cancelable:r=!1}={})=>{const i=t.$$.callbacks[e];if(i){const o=Q(e,n,{cancelable:r});return i.slice().forEach(c=>{c.call(t,o)}),!o.defaultPrevented}return!0}}function Mt(t,e){return d().$$.context.set(t,e),e}function Ht(t){return d().$$.context.get(t)}function It(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(r=>r.call(this,e))}const h=[],E=[];let _=[];const x=[],P=Promise.resolve();let v=!1;function V(){v||(v=!0,P.then(Y))}function Lt(){return V(),P}function X(t){_.push(t)}function Rt(t){x.push(t)}const g=new Set;let f=0;function Y(){if(f!==0)return;const t=p;do{try{for(;f<h.length;){const e=h[f];f++,b(e),Z(e.$$)}}catch(e){throw h.length=0,f=0,e}for(b(null),h.length=0,f=0;E.length;)E.pop()();for(let e=0;e<_.length;e+=1){const n=_[e];g.has(n)||(g.add(n),n())}_.length=0}while(h.length);for(;x.length;)x.pop()();v=!1,g.clear(),b(t)}function Z(t){if(t.fragment!==null){t.update(),M(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(X)}}function zt(t){const e=[],n=[];_.forEach(r=>t.indexOf(r)===-1?e.push(r):n.push(r)),n.forEach(r=>r()),_=e}export{wt as $,E as A,Ot as B,Lt as C,z as D,mt as E,X as F,Q as G,$ as H,tt as I,Y as J,rt as K,zt as L,p as M,b as N,B as O,h as P,V as Q,dt as R,ht as S,Tt as T,it as U,Bt as V,Mt as W,Ht as X,ft as Y,T as Z,at as _,et as a,_t as a0,vt as a1,It as a2,W as a3,jt as a4,kt as a5,bt as a6,Et as a7,Rt as a8,nt as a9,gt as b,At as c,Nt as d,C as e,K as f,yt as g,Ct as h,H as i,pt as j,U as k,St as l,ct as m,N as n,lt as o,ut as p,st as q,M as r,A as s,w as t,ot as u,xt as v,qt as w,Pt as x,S as y,Dt as z};
