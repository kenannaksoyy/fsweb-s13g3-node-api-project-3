const userModel = require("../users/users-model.js");

function logger(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  const method = req.method; //Get Post Put ...
  const url = req.originalUrl; // /api/users , /api/user/7 vb
  const timeStamp = new Date().toLocaleString();
  console.log(`İşlem: [${timeStamp}] ** ${method} -> ${url}`);
  //cevap yollaması için next dedik
  next();
}

async function validateUserId(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  try{
    const user = await userModel.getById(req.params.id);
    if(!user){
      res.status(404).json({
        message :"not found"
      })
      //cevap yollarsak next yazma
    }
    else{
      req.user = user;
      //get/:id de sadece req.user yaparak cevapı yollarız
    }
    next();
    //cevap için next
  }
  catch(err){
    res.status(500).json({
      message: "İslem yapılamadım"
    })
  }

}

function validateUser(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  // gelen body kontrolunu burada yaptık
  const { name } = req.body;
  if(!name){
    res.status(400).json({
      message:"name eksik"
    })
  }
  else{
    req.name = name;
    next();
  }
}

function validatePost(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  const {text} = req.body;
  if(!text){
    res.status(400).json({
      message:"text eksik"
    })
  }
  else{
    req.text=text;
    next();
  }
}

// bu işlevleri diğer modüllere değdirmeyi unutmayın

module.exports = {logger, validateUserId, validateUser, validatePost}