//사용자인증 미들웨어
const jwt = require("jsonwebtoken");
const { Users } = require("../models");

//항상 이 작업은 app.js에 cookie-parser있나확인!
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies; //cookies임 강의에는 cookie라 되어있음
    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer") {
      return res.status(401).json({
        errorMessage: "전달된 쿠키에서 오류가 발생하였습니다.",
      });
    }
    //만든 token을 decode(해독) 해봐야하기때문에 jwt를 가져옴옴(맨위)
    const decodedToken = jwt.verify(token, "secret-key");
    const userId = decodedToken.userId;
    //decode한 token내 userId를 가지고 사용자 인증
    const user = await Users.findOne({ where: { userId } });
    //mongoose(SQL)=findIdBy 사용
    if (!user) {
      res.clearCookie("authorization");
      return res.status(401).json({
        errorMessage: "토큰에 해당하는 사용자가 존재하지 않습니다.",
      });
    }
    //전역으로 돌리기
    res.locals.user = user;
    next();
  } catch (error) {
    res.clearCookie("authorization");
    return res.status(401).json({
      errorMessage: "비정상적인 접근입니다.",
    });
  }
};
