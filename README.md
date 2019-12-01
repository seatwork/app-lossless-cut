# 使用指南

当前项目源自另一个无损分割程序 [LosslessCut](https://github.com/mifi/lossless-cut)，起因是想改善LosslessCut的UI界面，该项目的Issue中也曾经提到新UI的计划，但始终未见升级。适逢近日正在学习Electron，便以此练手，开发了功能类似的Lossless-Cut应用软件。与原软件相比，当前软件除UI优化以外，也去除了一些不常用的操作，增加了提取音频功能。感谢 [LosslessCut](https://github.com/mifi/lossless-cut) 作者的贡献，尽管当前项目在代码方面几乎进行了重写，但依然借鉴了他的诸多实践。

### 快捷键

SPACE 播放/暂停
->    播放下一秒
<-    播放上一秒

### 下载

https://github.com/seatwork/lossless-cut/releases

### 编译

#### 1. 安装 Node

访问 [Node.js下载页面](https://nodejs.org/en/download)，选择Windows Installer。 下载完成后执行安装程序，根据引导完成安装即可。在安装过程中的配置界面, 请勾选Node.js runtime、npm package manager和Add to PATH这三个选项。通过 `node -v` 和 `npm -v` 命令来确认 node 和 npm 已经安装成功。

#### 2. 安装 Electron

推荐的安装方法是把它作为项目中的开发依赖项，以便能在不同的 app 中使用不同的 Electron 版本。 在项目所在目录中运行下面的命令：
```
npm install --save-dev electron
```

#### 3. 生成桌面应用

由于 `package.json` 中已经集成了打包命令所需参数，因此在项目目录下运行以下命令即可生成绿色版软件：
```
npm run package
```
