// pages/discuss/discuss.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postt:{},//正文帖子对象
    poster:{},//正文发帖人对象
    pathp:"cloud://scnuyjx-7gmvlqwfe64c446a.7363-scnuyjx-7gmvlqwfe64c446a-1304878008/userpic/",//头像图片绝对路径一部分
    pathq:"default.jpg",//正文发帖人头像相对路径
    pathtp:"cloud://scnuyjx-7gmvlqwfe64c446a.7363-scnuyjx-7gmvlqwfe64c446a-1304878008/postpic/",//帖子图片绝对路径一部分
    pdate:[],//正文最后活跃时间
    replys:0,//回帖数
    reply:[],//回帖帖子对象
    replyer:[],//回帖回帖者
    rdate:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //这个'1'到时候根据打开的帖子传入的信息修改
     wx.cloud.database().collection('post').doc('1').get().then(res=>{
       this.setData({
         postt:res.data,
         pdate:[res.data.activeTime.getFullYear(),
           res.data.activeTime.getMonth()+1,
           res.data.activeTime.getDate(),
           res.data.activeTime.getHours(),
           res.data.activeTime.getMinutes(),
           res.data.activeTime.getSeconds()],
         replys:res.data.comment.length
       })
       wx.cloud.database().collection('user').doc(String(res.data.user)).get().then(ret=>{
         this.setData({
           poster:ret.data,
           pathq:ret.data.image
         })
       })
       if(res.data.comment.length)
       {
         var fin=0 //回帖的帖子加载完毕数
         var finu=0 //回帖的用户加载完毕数
         var temp=[] //帖子与用户、头像地址、回帖嵌套者放在同一个(以数组实现结构体，便于结构体排序)
         for(let i=0;i<res.data.comment.length;++i) temp[i]=[]
 
         //头像预设为默认头像
         var tempImageDir = [] 
         for(let i=0;i<res.data.comment.length;++i) temp[i][2]=this.data.pathq
 
         //按时间降序排序依据函数
         function cmp(){
           return function(a,b){
             return b[0]['editTime']-a[0]['editTime']
           }
         }
 
         //获取所有回帖
         for(let i=0;i<res.data.comment.length;++i)
         {
           wx.cloud.database().collection('post').doc(String(res.data.comment[i])).get().then(reu=>{
             wx.cloud.database().collection('user').doc(String(reu.data.user)).get().then(rev=>{
               ++fin
               temp[i][1]=rev.data
               temp[i][2]=rev.data.image
               if(fin==res.data.comment.length*3) {//异步的某一次全部回帖帖子和回帖用户和嵌套用户均加载完毕
                 temp.sort(cmp())
                 this.setData({
                   reply:temp,
                   replys:res.data.comment.length
                 })
               }
             })
             if(reu.data.reply)
             {
               wx.cloud.database().collection('user').doc(String(reu.data.reply)).get().then(rew=>{
                 ++fin
                 temp[i][3]=rew.data
                 if(fin==res.data.comment.length*3) {//异步的某一次全部回帖帖子和回帖用户和嵌套用户均加载完毕
                   temp.sort(cmp())
                   this.setData({
                     reply:temp,
                     replys:res.data.comment.length
                   })
                 }
               })
             }
             else ++fin
 
             ++fin
             temp[i][0]=reu.data
             if(fin==res.data.comment.length*3){//异步的某一次全部回帖帖子和回帖用户和嵌套用户均加载完毕(实验表明不会在这里结束异步，但保险起见还是放着吧)
               temp.sort(cmp())
               this.setData({
                 reply:temp,
                 replys:res.data.comment.length
               })
             }
           })
         }
       }
     })
     
   },
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})