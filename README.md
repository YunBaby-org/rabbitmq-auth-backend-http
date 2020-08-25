# RabbitMQ Auth Backend HTTP

RabbitMQ 的 HTTP Authentication + Authorization 後端

## Authentication

這套服務是 RabbitMQ 的驗證後端，負責驗證使用者連線請求。

向 RabbitMQ 連線時，需要給出你的 username 還有 Authorization Code， Authorization Code 必須要 `HTTP POST /authentication` 來取得。

基於安全理由這個 Code 有下面這些限制

- 需要透過使用者先前登入的 JWT 驗證(未實作，目前只要給 {username: "someone"} 就給過)
- Authentication Code 在 Production 於 90 秒後過期, 其餘情況維持 30 分鐘
- Authentication Code 使用後即被 **consume**，意指每個 code 只能使用一次

## Authorization

Authorization 這部份管理使用者的權限(使用 RabbitMQ 內資源的權限)。基本上只有 RabbitMQ 本身會用到這部份的東西，所以不多寫，有興趣看
[https://github.com/rabbitmq/rabbitmq-auth-backend-http](https://github.com/rabbitmq/rabbitmq-auth-backend-http)

- `HTTP POST /auth/user` 回傳 user 是否能夠登入。目前需要 username 是 user 開頭, 且 password 是從 `HTTP POST /authentication` 取得的 Authorization token。每個 token 只能用一次。 username 和 password 必須對應。
- `HTTP POST /auth/vhost` 回傳 user 是否能使用對應的 vhost。目前只要 username 是 user 開頭，且 vhost 為 `/user` 就給過
- `HTTP POST /auth/topic` 回傳 user 能否對該 Topic 使用 Routing key。目前總是給過
- `HTTP POST /auth/resource` 回傳 user 能否使用對應資源。目前總是給過

## 測試 Authentication

```
# 指令
curl -X POST -H 'Content-Type: application/json' -i http://localhost:3000/authentication --data '{ "username": "user5566" }'
# 預期結果
{"status":"success","username":"user5566","authcode":"KJ.aAuTHzcf2EClE.yDUtGnQLDiUUXRzNymf1f3o6cF7Zg1FK6UfaRAgjV1d8iup.69axj4ryxmKH_4gU8zwXA--","timeout":1598326206}
```

## Testing Authorization with user

This demonstrate how RabbitMQ http auth backend plugin works, you don't need to know about it

```
# Get authorization code
$ curl -X POST -H 'Content-Type: application/json' -i http://localhost:3000/authentication --data '{ "username": "user5566" }'
{"status":"success","username":"user5566","authcode":"2iC4_gi0QPE5PVp7JvsOuZwylv_glQDIoohZkEJHgvmF_cZHkbfrk.xZ.D1XWIhynCjwzsYA_r1eqaaP0GGEag--","timeout":1598326269}

$ curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' -i http://localhost:3000/auth/user --data 'username=user5566&password=2iC4_gi0QPE5PVp7JvsOuZwylv_glQDIoohZkEJHgvmF_cZHkbfrk.xZ.D1XWIhynCjwzsYA_r1eqaaP0GGEag--'
allow
#
```

## 附註

- Authentication Code !== Access Token !== Refresh Token，他們三個不同概念

```

```

