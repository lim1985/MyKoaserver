const Koa = require('koa');
const app = new Koa();
//const myfn=require('./routers/index.js')
const router=require('./routers/index')
const cors= require('koa-cors')
const bodyparser=require('koa-bodyparser')
const koajwt = require('koa-jwt')
const secret = require('./config/secret.json')
const err = require('./middlreware/error')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fs = require('fs');
const path = require('path');
const Koa_Session = require('koa-session');  
// app.use(cors());
// 导入koa-session
app.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return false;
    }
    return 'http://172.20.8.28:8080';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

const store = {
  get(key) {
    const sessionDir = path.resolve(__dirname, './session');
    const files = fs.readdirSync(sessionDir);
    for (let i = 0; i < files.length; i++) {
      if (files[i].startsWith(key)) {
        const filepath = path.resolve(sessionDir, files[i]);
        console.log(filepath);
        delete require.cache[require.resolve(filepath)];
        const result = require(filepath);
        console.log(result);
        return result;
      }
    }
  },
  set(key, session) {
    const filePath = path.resolve(__dirname, './session', `${key}.js`);
    const content = `module.exports = ${JSON.stringify(session)};`;    
    fs.writeFileSync(filePath, content);
  },
  destroy(key){
    const filePath = path.resolve(__dirname, './session', `${key}.js`);
    fs.unlinkSync(filePath);
  }
}
// 配置
let session_config = {
  key: 'koa:sess', /**  cookie的key。 (默认是 koa:sess) */
  maxAge: 86400000,   /**  session 过期时间，以毫秒ms为单位计算 。*/
  autoCommit: true, /** 自动提交到响应头。(默认是 true) */
  overwrite: true, /** 是否允许重写 。(默认是 true) */
  httpOnly: true, /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
  signed: true, /** 是否签名。(默认是 true) */
  rolling: true, /** 是否每次响应时刷新Session的有效期。(默认是 false) */
  renew: false, /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
  store
};
// 这个是配合signed属性的签名key
const session_signed_key = ["limannlee"]; 
app.keys = session_signed_key;
const session = Koa_Session(session_config, app)


// app.use(err())     
// 使用中间件，注意有先后顺序
app.use(session)                               //  /api/login 参考的配置GetVerificatCode

  // ignore favicon
  // if (ctx.path === '/favicon.ico') return;
  // let n = ctx.session.views || 0;
  // ctx.session.views = ++n;
  // if (n >=5 ) ctx.session = null;
  // ctx.body = n + ' views';



// app.use(koajwt({secret: secret.sign}).unless({path: [/^\/api\/GetCode/,/^\/api\/login/,  /^\/api\/GetVerificatCode/,/^\/api\/createUser/]}))//正常可用的配置

//错误的例子 app.use(jwt({secret: secret.sign}).unless({path: [/^http\:\/\/127\.0\.0\.1\:3001\/api\/login/, /^\/api\/createUser/]}))
// app.use(function(ctx, next){
//   return next().catch((err) => {
//       if (401 == err.status) {
//           ctx.status = 401;
//           ctx.body = 'Protected resource, use Authorization header to get access\n';
//       } else {
//           throw err;
//       }
//   });
// });
// app.use(ctx => {
//   // ignore favicon
//   if (ctx.path === '/favicon.ico') return;
//   if(ctx.path==='/api/login')
//   {
//   let n = ctx.session.views || 0;
//   ctx.session.views = ++n;
//   ctx.body = n + ' views';
//   }
// });


// app.use(async (ctx, next) => {
//   ctx.set('Content-Type','application/x-www-form-urlencoded');
//   ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
//   ctx.set('Access-Control-Max-Age',3600);
//   await next();
//  });
app.use(bodyparser())


//给下面加上该属性 JWT 将不起作用 passthrough:true
// app.use(async (ctx, next) => {
//   // 允许来自所有域名请求
//   //ctx.set("Access-Control-Allow-Origin", "*");
//   // 这样就能只允许 http://localhost:8080 这个域名的请求了
//   ctx.set("Access-Control-Allow-Origin", "http://172.20.8.28:8080"); 
//   // 设置所允许的HTTP请求方法
//   ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

//   // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
//   ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
//   // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
//   // Content-Type表示具体请求中的媒体类型信息
//   ctx.set("Content-Type", "application/json;charset=utf-8");
//   // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
//   // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
//   ctx.set("Access-Control-Allow-Credentials", true);
//   // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
//   // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
//   // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
//   ctx.set("Access-Control-Max-Age", 300);
//   /*
//   CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
//       Cache-Control、
//       Content-Language、
//       Content-Type、
//       Expires、
//       Last-Modified、
//       Pragma。
//   */
//   // 需要获取其他字段时，使用Access-Control-Expose-Headers，
//   // getResponseHeader('myData')可以返回我们所需的值
//   ctx.set("Access-Control-Expose-Headers", "myData");
//   await next();
// })

app 
  .use(router.routes())
  .use(router.allowedMethods())
 
app.listen(3001,()=> {
        console.log('服务器启动了调用3001')
    });