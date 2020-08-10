小程序发帖交友平台--Eigen发帖博客
能够实现发布帖子、删除帖子、点赞、收藏、评论、附近好友、关注、粉丝、消息等功能

一个不错的开发项目，不过是我自己首次开发的，里面还有一些需要改进的地方，也有部分小Bug还待解决，不过总体功能还算完善，性能部分还有更多的提升空间


1、初始工作

基于云开发：
环境名称 social、环境ID social-z0706

数据库集合：
message、share、users需自己创建并权限设置“为所有用户可读，仅创建者可读写”

2、功能介绍

(1)、用户登录
用户初始进入界面需进行登录操作，获取wx用户信息

<img src="https://github.com/liu-yi-jun/wx-Eigen/blob/master/images/login.PNG" width="276" height="597" alt="微信小程序"/><br/>

(2)、用户个人页面
这里展示个人用户的资料信息，发布过帖子，关注的用户、粉丝的数量，以及收藏和喜欢的帖子等

<img src="https://github.com/liu-yi-jun/wx-Eigen/blob/master/images/user.PNG" width="276" height="597" alt="微信小程序"/><br/>

(3)、消息接收
当其他用户对你的作品进行点赞，或者关注了你时会有消息通知。评论作品未实现通知

<img src="https://github.com/liu-yi-jun/wx-Eigen/blob/master/images/message.PNG" width="276" height="597" alt="微信小程序"/><br/>

(4)、发布帖子
在这个页面可以进行发布个人的帖子，帖子的图片限制为9张，该页面会自动弹出选择图片，选择不足时可后续添加，或者删除。帖子的标题与内容为必填，填好后可以正常发布，发布成功会自动跳转到首页，最新哪里显示你发布的帖子

<img src="https://github.com/liu-yi-jun/wx-Eigen/blob/master/images/add.PNG" width="276" height="597" alt="微信小程序"/><br/>

(5)、附近功能
附近页面采用wx提供的map组件进行开发，附近功能主要能够在一定的范围内寻找用户，并显示在地图上，用户的头像可以点击，会跳转到其他用户的页面介绍，共享位置可以在设置中开启或关闭。用户初始使用时打开该页面会询问是否授权地理位置信息，用户自行选择，用户如果选择取消按钮，当用户想开启附近功能时需要用户自己在微信小程序设置的地方开启授权地理位置

<img src="https://github.com/liu-yi-jun/wx-Eigen/blob/master/images/near.PNG" width="276" height="597" alt="微信小程序"/><br/>


(6)、首页
首页主要将所有用户的帖子进行展示，这里有推荐与最新的排序方式，推荐主要是依据帖子的点赞数量，最新依据发布帖子的时间进行排序显示，这里主要是用遍历的方式进行展示，性能方面会较差，需改进，并且还没有实现按需加载的功能

<img src="https://github.com/liu-yi-jun/wx-Eigen/blob/master/images/index.PNG" width="276" height="597" alt="微信小程序"/><br/>

(7)、设置页面
根据自己的爱好，对个人信息进行修改，以及是否开启共享位置

<img src="https://github.com/liu-yi-jun/wx-Eigen/blob/master/images/setter.PNG" width="276" height="597" alt="微信小程序"/><br/>

(8)、帖子详细页
将帖子的内容表现出来，帖子的内容信息，发布的时间等，功能有点赞、收藏、评论功能

<img src="https://github.com/liu-yi-jun/wx-Eigen/blob/master/images/item.PNG" width="276" height="597" alt="微信小程序"/><br/>

(9)、其他用户页面
点击其他用户的头像可以进入该页面，展示其他用户的一些信息，可以查看是否对该用户关注了，在用户的对象右上方加号表示加关注，减号表示取消关注。点击自己的头像不会显示关注或者取消关注的图标。其他用户页面的帖子、关注、粉丝没有实现点击功能，可根据自己的需求补充

<img src="https://github.com/liu-yi-jun/wx-Eigen/blob/master/images/other.PNG" width="276" height="597" alt="微信小程序"/><br/>

3、已经发现的Bug或需改进的地方
(1)、发布帖子时选择的图片顺序，发布后的帖子图片会出现乱序现象，这里是因为异步请求时push进入数组的图片先后问题，待解决
(2)、消息页面用微信监听api监听消息数组，bug主要出现在当自己删除消息时会出现红点提示，主要原因是监听到消息数组的变化
(3)、首页未实现按需加载
(4)、用户聊天功能没有实现
(5)、无法评论其他用户的评论

接下来会进行学习改进
该项目是体验版，有必要时联系我，加入体验成员

交流、合作wx：Eigens，申请时备注 “gitHub项目”  

