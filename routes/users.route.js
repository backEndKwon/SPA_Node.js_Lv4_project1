const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

//회원가입 api
router.post("/signup", async (req, res) => {
  // try {
    const { nickname, password, confirm} = req.body;
    const isExistUser = await Users.findOne({
      where: {
        nickname: nickname,
      },
    });
    console.log(password, confirm);
    if (isExistUser) {
      return res.status(409).json({
        errorMessage: "중복된 닉네임입니다.",
      });
    }
    const checkNickname = /^[a-zA-Z0-9]{3,}$/.test(nickname);
    if (!checkNickname) {
      res.status(412).json({
        errorMessage: "닉네임의 형식이 올바르지 않습니다.",
      });
      return;
    }
    //패스워드 일치 검사
    if (password !== confirm) {
      res.status(412).json({
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
      return;
    }
    //패스워드 길이 검사(4자이상)
    if (password.length < 4) {
      res.status(412).json({
        errorMessage: "패스워드 형식이 일치하지 않습니다.",
      });
      return;
    }
    //패스워드에 닉네임 포함 검사
    if (password.includes(nickname)) {
      res.status(412).json({
        errorMessage: "패스워드에 닉네임이 포함되어있습니다.",
      });
      return;
    }
    await Users.create({ nickname, password });

    return res.status(201).json({ message: "회원가입에 성공하였습니다." });
  // } catch (err) {
  //   res.status(400).json({
  //     errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
  //   });
  // }
});

//로그인 api
router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = req.body;
    const user = await Users.findOne({
      where: { nickname },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
      });
    }

    //로그인 시 토큰생성
    const token = jwt.sign(
      {
        userId: user.userId,
      },
      "secret-key"
    );
    res.cookie("authorization", `Bearer ${token}`);
    return res.status(200).json({ message: "로그인에 성공하였습니다." });
  } catch (err) {
    res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
  }
});

module.exports = router;
