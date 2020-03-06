class WXController {
  static async GettokenCode(ctx)
  {
    const data=ctx.request.query
    ctx.body={
        data
    }  
    
  
  }
  
  //返回Wxtokens
  static async returnAccessToken()
  {   
      let appid="wxe46fad5310ffbfed";
      let secret="4da9927de12b02f7a8b50f690974921c";
      let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appid+"&secret="+secret;
        //https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
      return url;
    //30_tL_nJ8W-UhJWvQqETaOochCngcWifXX2HPLiNQgcl6PWVo3_z-T5bOkaOBP23G3uygAFdYP9yk93AdmidaeZMzhX3SPqK-dfnXLYR2qc3-1CkmFfdQNhmXF3r7Q8fwe4e0cSiq0To2iJ8jK6OKUjAEAYUE
  }
}

module.exports = WXController