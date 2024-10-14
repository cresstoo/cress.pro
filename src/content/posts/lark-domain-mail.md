---
title: 免费域名邮箱之Lark企业邮箱
date: 2024-10-14 22:27:59
tags: [Lark, Mail, Domain]
category: Hacks
---

### 域名邮箱寄居史

以前申请个站域名之后就一直把域名邮箱托管在Google企业邮箱，自从升级成Workplace之后浓眉大眼的Google也开始收费了，在到期之前四下寻找免费服务的时候，发现iCloud居然支持自定义域名邮箱服务，解了燃眉之急。然而iCloud由于众所周知的原因，墙内外同步一直不是很稳定，直连规则有时候会挂掉，代理规则有时候又会解析失败，用阿里云DNS转发了也是这样，有时候换了个梯子就莫名其妙收发不到邮件了，在duran.im域名到期之前我又想再折腾一个免费服务，顺便把老域名邮箱下注册的一些网站账号给注销或者更换掉。

### Lark企业邮箱简介

对比了多家国内外服务之后，发现飞书国际版Lark提供免费的200G企业邮箱，而且我使用🇯🇵代理注册居然并没有像有的攻略说的验证海外电话，果断搬家。

![LarkMail](https://framerusercontent.com/images/koeQshc7RdPg4pKBFFs5lPqZAwM.png)

**先来了解一下Lark企业邮箱的基本规格**

|                      | 免费版          | Pro/旗舰版       |
| -------------------- | --------------- | ---------------- |
| 邮箱容量             | 200G            | 5TB/不限         |
| 用户数上限           | 50              | /                |
| 单用户每日发送上限   | 450封           | 6000封           |
|                      | 200个外部收件人 | 2000个外部收件人 |
| 企业整体每日发送上限 | 450\*用户数 封  | 6000\*用户数 封  |
| （含公共邮箱用户）   | 500个外部收件人 | 无限制           |

可以看到，如果只是个人或者小微团队，免费版的容量是肯定够用了，还能同时拥有100G云文档、100G妙记（智能会议纪要、语音转文字）和不限量的文档翻译服务。

### Lark域名邮箱配置步骤

第一步：挂🪜注册一个免费的企业账户，公司行业随意。` 不过要注意的是，Lark会判断IP地理位置来提供服务，我选择的日区，并未提示我提供日本手机号验证，不保证其他地区是否要求验证海外手机号。` 注册成功后进入Lark管理后台，默认会显示日语界面，可以随时更改界面语言。

第二步：Lark 管理后台点击 **产品设置** > **邮箱**> **服务管理** > **域名管理**，点击启用新的邮箱服务。

![78b498c5a1064b0a9a2c0165e95effb5~tplv-hn4qzgxq2n-image:0:0.image](https://p16-hera-va.larksuitecdn.com/tos-useast2a-i-hn4qzgxq2n/78b498c5a1064b0a9a2c0165e95effb5~tplv-hn4qzgxq2n-image:0:0.image)

第四步：输入域名， 转入自己的域名服务商后台，添加DNS 解析记录，点立即验证成功。

![DNS绑定](https://p16-hera-va.larksuitecdn.com/tos-useast2a-i-hn4qzgxq2n/a16d3c8aa68249e09a5746e79a3f1271~tplv-hn4qzgxq2n-image:0:0.image)

第五步：Lark 管理后台点击 **企业管理** > **组织架构** > **成员与部门**，点击当前用户的**详情** >**编辑基本信息**，为成员添加一个企业邮箱地址，比如123[at]cress.pro。即可在管理后台切换进邮箱应用，开始收发邮件了。

![img](https://p16-hera-va.larksuitecdn.com/tos-useast2a-i-hn4qzgxq2n/4e3f52b0ab67410bbd6c1874bd87f37d~tplv-hn4qzgxq2n-image:0:0.image)

![img](https://p16-hera-va.larksuitecdn.com/tos-useast2a-i-hn4qzgxq2n/cd5cba952eb147beb0fd131e3c964434~tplv-hn4qzgxq2n-image:0:0.image)

### 如何新增邮箱

只有自己一个人用的话就是给当前超级管理员添加一个前缀邮箱就行了。如果想增加一个邮箱（比如456[at]cress.pro），就需要先新增一个成员。

![img](https://p16-hera-va.larksuitecdn.com/tos-useast2a-i-hn4qzgxq2n/db53fcff5ec94f69bb2771d0b4f4ff78~tplv-hn4qzgxq2n-image:0:0.image)

用另外的站外的联系邮箱添加一个企业成员，用同样的方式为新成员分配企业邮箱，可以指定该成员的登录密码。

邀请成员注册验证成功之后，也可以把成员登录Lark的联系邮箱改为企业邮箱，不过需要超级管理员和成员自己的注册邮箱多验证几次就可以操作成功了。

### 第三方客户端收发邮件

如果不想用Lark客户端或者网页来收发邮件，而是更习惯邮件客户端，那么就需要用到Lark的公共邮箱功能，公共邮箱可以让多位成员共享一个邮箱收发信息。

管理员可以为每位成员添加一个新的公共邮箱，然后在后台开启第三方邮箱客户端的权限，就可以用这个公共邮箱来登录第三方客户端。不过SMTP有200封/100秒的发信频率限制。具体设置步骤如下，我本人不需要，就直接贴官方教程了。

[1. 开启第三方邮箱客户端](https://www.larksuite.com/hc/zh-CN/articles/360048488295-%E7%AE%A1%E7%90%86%E5%91%98%E5%BC%80%E5%90%AF%E7%AC%AC%E4%B8%89%E6%96%B9%E9%82%AE%E7%AE%B1%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%99%BB%E5%BD%95%E8%AE%BE%E7%BD%AE)

[2. 设置公共邮箱](https://www.larksuite.com/hc/zh-CN/articles/360048487998-%E7%AE%A1%E7%90%86%E5%91%98%E5%88%9B%E5%BB%BA%E5%85%AC%E5%85%B1%E9%82%AE%E7%AE%B1%E6%94%B6%E5%8F%91%E9%82%AE%E4%BB%B6)

Lark还支持添加多个域名、域名别名等功能，目前域名数量没有上限，所以我把新旧域名邮箱都搬了过来。

**更多官方设置使用文档**

[1. 快速上手Lark邮箱](https://www.larksuite.com/hc/zh-CN/articles/060189324503-%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B-lark-%E9%82%AE%E7%AE%B1)

[2. Lark企业邮箱管理帮助文档](https://www.larksuite.com/hc/zh-CN/category/7084148234074980357-%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%E7%AE%A1%E7%90%86)
