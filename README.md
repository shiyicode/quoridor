# quoridor

## 游戏体验

### 微信小游戏端

![wechat](https://github.com/shiyicode/quoridor/blob/master/readme-image/wechat_play.JPG)

## 游戏预览

### 欢迎场景
![welcome](https://github.com/shiyicode/quoridor/blob/master/readme-image/IMG_0660.PNG)

### 菜单场景
![menu](https://github.com/shiyicode/quoridor/blob/master/readme-image/IMG_0660.PNG)

### 帮助场景
![help](https://github.com/shiyicode/quoridor/blob/master/readme-image/IMG_0653.PNG)

### 好友对战
![team](https://github.com/shiyicode/quoridor/blob/master/readme-image/IMG_0655.PNG)

### 随机匹配
![match](https://github.com/shiyicode/quoridor/blob/master/readme-image/IMG_0654.PNG)

### 二人游戏
![welcome](https://github.com/shiyicode/quoridor/blob/master/readme-image/IMG_0660.PNG)


## 研发工具
- 客户端：cocos creator
- 服务端：MGBOE小游戏联机对战引擎
- UI设计：Sketch

## 游戏介绍

​	墙棋，又名围追堵截、步步为营，英文名为Quoridor。是著名游戏设计师Mirko Marchesi设计的著名游戏，此款游戏也被游戏杂志《game》评为“20世纪最受欢迎的益智游戏”。

​	滞延对手，诱入陷阱。和中国围棋有异曲同工之妙。



![howtoplay](https://github.com/shiyicode/quoridor/blob/master/readme-image/howtoplay.png)



### 胜利条件

​	先将棋子移动至对边任意一格即为胜利。



### 游戏流程

​	两人或四人轮流操作，每次可选择以下两种操作：

​	**1. 移动棋子：点击棋子，获取棋子可走位置，用以移动棋子。**

​	**2. 放置木板：手指按住棋盘，拖动以放置木板。木板有数量限制，二人模式各十片，四人模式各五片。**



### 游戏规则

​	**移动棋子：**

1. 棋子每次只能移动一格，可选择上、下、左、右四个方位进行移动，不能斜角移动；棋子移动不能跨越围墙。
![chess_move1](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move1.png)

2. 若棋子相邻，可以跳至相邻棋子的正后方；但不能一次跳过两个及以上数目的棋子。
![chess_move2](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move2.png)
![chess_move3](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move3.png)

3. 若相邻棋子后方有墙，则可以跳至相邻棋子的左方或右方。
![chess_move4](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move4.png)
![chess_move5](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move5.png)



​	**放置木板：**

1. 木板放置不可将任意玩家的所有获胜路线堵死。

2. 木板放置不可重叠、不可交叉。

![wall_move](https://github.com/shiyicode/quoridor/blob/master/readme-image/wall_move.png)
