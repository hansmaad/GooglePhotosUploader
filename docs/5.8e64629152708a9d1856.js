(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"7UCR":function(n,i,t){"use strict";t.r(i),t.d(i,"UserModule",(function(){return g}));var e=t("ofXK"),r=t("tyNb"),c=t("mrSG"),o=t("fXoL"),b=t("3u5A"),s=t("0MCZ");function a(n,i){if(1&n){const n=o.Nb();o.Mb(0,"div"),o.Mb(1,"button",9),o.Tb("click",(function(){return o.ic(n),o.Wb().signIn()})),o.oc(2,"Sign in"),o.Lb(),o.Lb()}}function u(n,i){if(1&n&&(o.Mb(0,"a",11),o.Ib(1,"img",12),o.Lb()),2&n){const n=o.Wb(2);o.xb(1),o.dc("alt","Logged in as ",n.profile.name,""),o.cc("src",n.profile.image,o.jc)}}function l(n,i){if(1&n){const n=o.Nb();o.Kb(0),o.mc(1,u,2,2,"a",10),o.Mb(2,"p"),o.Mb(3,"strong"),o.oc(4),o.Lb(),o.Lb(),o.Mb(5,"button",9),o.Tb("click",(function(){return o.ic(n),o.Wb().signOut()})),o.oc(6,"Sign out"),o.Lb(),o.Jb()}if(2&n){const n=o.Wb();o.xb(1),o.cc("ngIf",n.profile),o.xb(3),o.pc(n.profile.name)}}const p=[{path:"",component:(()=>{class n{constructor(n){this.gapiService=n,this.loading=!1}ngOnInit(){return Object(c.b)(this,void 0,void 0,(function*(){this.loading=!0;try{this.profile=this.gapiService.getProfile()}finally{this.loading=!1}}))}signIn(){return Object(c.b)(this,void 0,void 0,(function*(){yield this.gapiService.selectAccount(),this.profile=this.gapiService.getProfile()}))}signOut(){return Object(c.b)(this,void 0,void 0,(function*(){yield this.gapiService.signOut(),this.profile=null}))}}return n.\u0275fac=function(i){return new(i||n)(o.Hb(b.a))},n.\u0275cmp=o.Bb({type:n,selectors:[["app-user"]],decls:13,vars:2,consts:[["sidebar",""],[1,"app-sidebar-main","pt-5"],[1,"app-sidebar-nav"],["routerLink","/upload"],["toolbar",""],[1,"app-toolbar-btns"],["content",""],[1,"vh-100","d-flex","flex-column","justify-content-center","align-items-center"],[4,"ngIf"],["type","button",1,"btn","btn-primary",3,"click"],["class","app-user-btn","routerLink","/user","style","font-size: 2.5em",4,"ngIf"],["routerLink","/user",1,"app-user-btn",2,"font-size","2.5em"],["referrerpolicy","no-referrer",3,"src","alt"]],template:function(n,i){1&n&&(o.Mb(0,"app-layout"),o.Kb(1,0),o.Mb(2,"div",1),o.Mb(3,"ul",2),o.Mb(4,"li"),o.Mb(5,"a",3),o.oc(6," Back "),o.Lb(),o.Lb(),o.Lb(),o.Lb(),o.Jb(),o.Kb(7,4),o.Ib(8,"div",5),o.Jb(),o.Kb(9,6),o.Mb(10,"div",7),o.mc(11,a,3,0,"div",8),o.mc(12,l,7,2,"ng-container",8),o.Lb(),o.Jb(),o.Lb()),2&n&&(o.xb(11),o.cc("ngIf",!i.profile),o.xb(1),o.cc("ngIf",i.profile))},directives:[s.a,r.b,e.l],encapsulation:2}),n})()}];let f=(()=>{class n{}return n.\u0275mod=o.Fb({type:n}),n.\u0275inj=o.Eb({factory:function(i){return new(i||n)},imports:[[r.c.forChild(p)],r.c]}),n})();var d=t("PCNd");let g=(()=>{class n{}return n.\u0275mod=o.Fb({type:n}),n.\u0275inj=o.Eb({factory:function(i){return new(i||n)},imports:[[e.c,d.a,f]]}),n})()}}]);