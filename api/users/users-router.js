const express = require('express');
const {logger,validatePost,validateUserId,validateUser} = require("../middleware/middleware.js");
// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();
const userModel = require("./users-model.js");
const postModel = require("../posts/posts-model.js");

router.get('/',(req, res, next) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  userModel.get()
  .then( users => {
    res.status(200).json(users)
  })
  .catch(next)
  //catcht next ile sayfanın sonundaki GG oldu hatasına gitcek
});

router.get('/:id', validateUserId,(req, res, next) => {
  //validateUserId ilk çalıscak

  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  res.status(201).json(req.user);
  //req.user değeri validateUserId dan geliyor

});

router.post('/',validateUser, (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  userModel.insert({name:req.name})
  .then( createdUser =>{
    res.status(200).json(createdUser);
  })
  .catch(next)
});

router.put('/:id',validateUserId, validateUser, async (req, res, next) => {
  //validateUserId yapınca next ile validatePost geccek

  
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.

  try{
    //2 kontrolde yapıldı
    await userModel.update(req.params.id, {name: req.name});
    const upUser = await userModel.getById(req.params.id);
    res.status(201).json(upUser);
  }
  catch(err){
    next(err);//parametreyide verebiliriz err ile eşlesir
  }

  
});

router.delete('/:id',validateUserId, async(req, res, next) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try{
    const deleteCode = await userModel.remove(req.params.id);
    if(deleteCode==1){
      res.status(201).json(req.user);
    }
    else{
      res.status(400).json({
        message: "Şanslı Çıktı"
      })
    }
  }
  catch(err){
    next(err)
  }

});

router.get('/:id/posts',validateUserId, async(req, res,next) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try{
    const postResult = await userModel.getUserPosts(req.params.id);
    res.status(200).json(postResult);
  }
  catch(err){
    next(err);
  }

});

router.post('/:id/posts',validateUserId,validatePost, async(req, res, next) => {
  // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.

  try{
    const resultPost = await postModel.insert({
      user_id:req.params.id,
      text:req.text
    });
    res.status(200).json(resultPost);

  }
  catch(err){
    next(err);
  }

});

// routerı dışa aktarmayı unutmayın

router.use((err,req,res,next) => {
  res.status(err.status || 500).json({
    customMessage: "Malesef olmadı",
    message: err.message
  });
});

module.exports = router;