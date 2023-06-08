<template>
  <div class="login">
    <div class="countdown">
      <div>
        <img src="../assets/images/login/asianGamesLogo.png"/>
      </div>
      <div class="countdown_line"></div>
      <div class="countdown_text">
        <div>距离杭州2023年亚运会</div>
        <div>倒计时 <span>{{countdown}}</span> 天</div>
      </div>
    </div>
    <div class="content-wrap">
      <div class="login-wrap">
        <div class="title">欢迎登录</div>
        <div class="form-wrap">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <el-form-item prop="username" style="margin-bottom:37px">
              <el-input
                  v-model="loginForm.username"
                  type="text"
                  auto-complete="off"
                  placeholder="请输入账号">
                  <img class="icon" src="../assets/images/login/icon-user.png" slot="prefix" alt="">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    v-model="loginForm.password"
                    type="password"
                    auto-complete="off"
                    placeholder="密码"
                    @keyup.enter.native="handleLogin">
                    <img class="icon" src="../assets/images/login/icon-lock.png" slot="prefix" alt="">
                </el-input>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe">记住登录状态</el-checkbox>
            <el-form-item style="width:100%;">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleLogin">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
              </el-button>
       
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>Copyright © 2018-2023 ruoyi.vip All Rights Reserved.</span>
    </div> -->
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,

      countdown: 0
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // this.getCode();
    this.getCookie();

    let nowTime = new Date();//获取当前时间
    let setTime = new Date('2023/09/23');//设置结束时间
    let remianAllSeconds = Math.ceil((setTime.getTime() - nowTime.getTime()) / 1000);//剩余总秒数
    let remainDays = Math.ceil(remianAllSeconds / (60 * 60 * 24));//剩余天数
    this.countdown = remainDays
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: "/platform" }).catch(()=>{});
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login/bg.png");
  background-position: left bottom;
  background-size: cover;
  position: relative;

  .content-wrap{
    position: absolute;
    right: 20%;
    top: 50%;
    height: 680px;
    transform: translate(00%, -50%);
    display: flex;
    align-items: center;

    .img-wrap{
      width: 803px;
      height: 632px;
      background-image: url("../assets/images/login/img.png");
      background-size: cover;
    }

    .login-wrap{
      width: 566px;
      height: 680px;
      background-color: #fff;
      box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.18);
      border-radius: 12px;
      overflow: hidden;

      .title{
        font-size: 36px;
        color: #000;
        font-weight: 500;
        text-align: center;
        margin-top: 125px;
      }

      .form-wrap{
        width: 100%;
        box-sizing: border-box;
        padding: 0 44px;
        padding-top: 44px;

        .el-input{
          border-radius: 28px;
        }

        .el-input__inner{
          height: 56px; 
          font-size: 20px;
          padding-left: 48px;
          border-radius: 28px;
          background: rgba(240, 241, 245, 0.3);
        }

        .el-input__prefix{
          display: flex;
          align-items: center;
          justify-content: center;
          left: 16px;
        }

        .icon{
          width: 24px;
          height: 24px;
        }

        .el-button{
          height: 56px;
          background-color: #409EFE;
          border-color:#409EFE;
          border-radius: 28px;
          margin-top: 44px;
        }
      }
    }
  }
}
.countdown{
  position: absolute;
  top: 88px;
  left: 88px;
  display: flex;
  align-items: center;
  img{
    width: 133px;
    height: 133px;
  }
  .countdown_line{
    border-right: 1.5px dashed #1EA9FF;
    height: 102px;
    margin-left: 8px;
    margin-right: 26px;
  }
  .countdown_text{
    color: #595959;
    font-size: 28px;

    span{
      color: #409EFE;
      font-size: 43px;
    }
  }
}
</style>
