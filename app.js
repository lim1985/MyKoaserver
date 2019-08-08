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

// const logger = require('koa-logger')

// app.use(err())                                    //  /api/login 参考的配置
app.use(cors())
//app.use(koajwt({secret: secret.sign}).unless({path: [/^\/api\/login/, /^\/api\/createUser/]}))//正常可用的配置
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



// app.use(async (ctx, next) => {
//   ctx.set('Content-Type','application/x-www-form-urlencoded');
//   ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
//   ctx.set('Access-Control-Max-Age',3600);
//   await next();
//  });
app.use(bodyparser())
// 给下面加上该属性 JWT 将不起作用 passthrough:true


app 
  .use(router.routes())
  .use(router.allowedMethods())
 
app.listen(3001,()=> {
        console.log('服务器启动了调用3001')
    });