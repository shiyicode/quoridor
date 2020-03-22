# quoridor

## 帮助

### 游戏介绍

​	墙棋，又名围追堵截、步步为营，英文名为Quoridor。是著名游戏设计师Mirko Marchesi设计的著名游戏，此款游戏也被游戏杂志《game》评为“20世纪最受欢迎的益智游戏”。

​	滞延对手，诱入陷阱。和中国围棋有异曲同工之妙。



![howtoplay](https://github.com/shiyicode/quoridor/blob/master/readme-image/howtoplay.png)



### 胜利条件

​	先将棋子移动至对边任意一格即为胜利。



### 游戏流程

​	两人或四人轮流操作，每次可选择以下两种操作：

​	**1. 移动棋子：点击棋子，则显示棋子的全部可走位置；点击其中一处可走位置，则可以移动棋子。**

​	**2. 放置木板：手指按住棋盘部分，拖动时产生木板阴影；拖动木板阴影到想要放置木板的位置，松开手指即可放置木板；**

​	注：木板长度为两个棋格长度。木板存在数量限制，若木板用完则只能移动棋子；二人对战时，玩家各持有十片木板；四人对战时，玩家各持有五片木板。



### 游戏规则

​	**移动棋子：**

1. 棋子每次只能移动一格，可选择上、下、左、右方位进行移动，不能斜角移动；棋子移动时不能跨越围墙。
![chess_move1](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move1.png)

2. 若棋子相邻时，可以跳至相邻棋子的正后方；但不能一次跳过两个及以上数目的棋子。
![chess_move2](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move2.png)
![chess_move3](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move3.png)

3. 若相邻棋子后方有墙时，则可以跳至相邻棋子的左方或右方。
![chess_move4](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move4.png)
![chess_move5](https://github.com/shiyicode/quoridor/blob/master/readme-image/chess_move5.png)



​	**放置木板：**

1. 木板放置不可将任意玩家的所有获胜路线堵死。

2. 木板放置不可重叠，不可交叉。

![wall_move](https://github.com/shiyicode/quoridor/blob/master/readme-image/wall_move.png)
