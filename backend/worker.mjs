/**
 * Just Protect lead receiver — Cloudflare Worker, Resend email API, KV rate limit.
 * Configure all secrets in Cloudflare (NEVER in browser files).
 * Not active until deployed. See README.md.
 */
const STATES=new Set(['Illinois','Indiana','Michigan','Ohio']);
const enc=new TextEncoder();
const json=(payload,status,origin='')=>new Response(JSON.stringify(payload),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':origin,'Vary':'Origin'}});
const validEmail=s=>typeof s==='string'&&s.length<=180&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const clean=(v,max=2000)=>typeof v==='string'?v.trim().slice(0,max):'';
const safe=(s)=>clean(s,1000).replace(/[\r\n]+/g,' ');
function configurationReady(env){return Boolean(env.RESEND_API_KEY&&env.TO_EMAIL&&env.FROM_EMAIL&&env.ALLOWED_ORIGIN&&env.LEAD_LIMIT_KV)}
export default {
 async fetch(request,env){
   const origin=request.headers.get('Origin')||'';
   const allowed=env.ALLOWED_ORIGIN||'';
   if(!origin||origin!==allowed)return json({ok:false,error:'Origin not allowed'},403);
   if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'300','Vary':'Origin'}});
   if(request.method!=='POST'||new URL(request.url).pathname!=='/lead')return json({ok:false,error:'Not found'},404,allowed);
   if(!configurationReady(env))return json({ok:false,error:'Lead service is not configured'},503,allowed);
   const type=request.headers.get('content-type')||'';
   if(!type.toLowerCase().includes('application/json'))return json({ok:false,error:'Expected JSON'},415,allowed);
   const length=Number(request.headers.get('content-length')||0);
   if(length>12000)return json({ok:false,error:'Request too large'},413,allowed);
   let body;
   try{const raw=await request.text();if(enc.encode(raw).length>12000)throw Error('too large');body=JSON.parse(raw)}catch(e){return json({ok:false,error:'Invalid or oversized request'},400,allowed)}
   if(!body||typeof body!=='object'||Array.isArray(body))return json({ok:false,error:'Invalid request'},400,allowed);
   // Honeypot is only supplemental; it is not a replacement for server-side rate limiting.
   if(body.website)return json({ok:true,message:'Request received'},200,allowed);
   const fields=['name','email','phone','state','zip','property','service','details'];
   for(const f of fields)if(typeof body[f]!=='string')return json({ok:false,error:'Invalid fields'},400,allowed);
   if(!validEmail(body.email)||!clean(body.name,120)||!STATES.has(body.state)||!/^\d{5}$/.test(body.zip)||!clean(body.service,120)||body.consent!==true)return json({ok:false,error:'Check contact, location and consent fields'},422,allowed);
   if(body.details.length>2500||body.name.length>120||body.phone.length>60||body.service.length>120||body.property.length>80)return json({ok:false,error:'Field length exceeds limit'},422,allowed);
   // Basic per-IP quota: KV is eventually consistent. Consider stronger Turnstile/WAF at production scale.
   const ip=request.headers.get('CF-Connecting-IP')||request.headers.get('x-forwarded-for')||'unknown';
   const hour=Math.floor(Date.now()/3600000);
   const ipKey=await crypto.subtle.digest('SHA-256',enc.encode(ip+':'+hour));
   const key='lead:'+Array.from(new Uint8Array(ipKey)).map(b=>b.toString(16).padStart(2,'0')).join('');
   const previous=Number(await env.LEAD_LIMIT_KV.get(key)||0);
   if(previous>=3)return json({ok:false,error:'Too many requests; please try again later or email us directly'},429,allowed);
   await env.LEAD_LIMIT_KV.put(key,String(previous+1),{expirationTtl:3800});
   const lines=[
     'JUST PROTECT / INSTALLATION REQUEST',
     'Service: '+safe(body.service),'State: '+safe(body.state),'ZIP: '+safe(body.zip),
     'Property: '+safe(body.property),'Name: '+safe(body.name),'Email: '+safe(body.email),
     'Phone: '+safe(body.phone||'Not supplied'),'Project:',clean(body.details,2500)||'Not supplied'
   ];
   let result;
   try{result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.FROM_EMAIL,to:[env.TO_EMAIL],reply_to:clean(body.email,180),subject:'Just Protect Project — '+safe(body.service).slice(0,75),text:lines.join('\n')})});}
   catch(e){return json({ok:false,error:'Email delivery service unavailable. Use the email option.'},502,allowed)}
   if(!result.ok)return json({ok:false,error:'Unable to deliver request. Use the email option.'},502,allowed);
   return json({ok:true,message:'Your request was accepted for delivery.'},200,allowed);
 }
};
