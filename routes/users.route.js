const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt"); //패스워드 해시화

// 1)회원가입
//CRUD : create, HTTP method : post

// 1-0) 닉네임/패스워드 유효성 검사 사전 세팅
const checkNickname = /^[a-zA-Z0-9]{3,10}$/;
const checkPassword = /^[a-zA-Z0-9]{4,20}$/;
const userCheck = Joi.object({
  nickname: Joi.string().pattern(checkNickname).required(),
  password: Joi.string().pattern(checkPassword).required(),
  confirm: Joi.valid(Joi.ref("password")).required(),
});

router.post("/signup", async (req, res) => {
  try {
    const { nickname, password, confirm } = await userCheck.validateAsync(
      req.body
    );

    // 1-1) 닉네임 유효성 검사
    if (!checkNickname) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임형식이 올바르지 않습니다." });
    }

    // 1-2)닉네임 중복 검사
    const isExistUser = await Users.findOne({
      where: { nickname: nickname },
    });
    if (isExistUser) {
      return res
        .status(409)
        .json({ errorMessage: "이미 존재하는 아이디입니다." });
    }

    // 1-3) 패스워드 4글자 이상 검사
    if (password.length < 4) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드 형식이 올바르지 않습니다." });
    }

    // 1-4) 패스워드 일치 검사
    if (password !== confirm) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드가 일치하지 않습니다." });
    }
    // 1-5) 패스워드에 닉네임 포함 검사
    if (password.includes(nickname)) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }
    //패스워드 hash처리로 보안성 강화 cost값 10~12정도면 적당
    //cost값은 해시함수를 2의10승 반복 적용하여 hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({ nickname, password: hashedPassword });
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    console.log(`${hours}시 ${minutes}분에 ${nickname}님이 가입하셨습니다.`);
    return res.status(200).json({ message: "회원가입에 성공하였습니다." });
  } catch (err) {
    res.status(400).json({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

// 2) 로그인
// HTTP method : post
// 2-0) 로그인 유효성 검사 사전 세팅

const loginCheck = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});

router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = await loginCheck.validateAsync(req.body);
    const user = await Users.findOne({
      where: { nickname: nickname },
    });
    if (!user) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임을 다시 확인해주세요" });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드를 다시 확인해주세요" });
    }

    let expires = new Date(); //날짜타입
    expires.setMinutes(expires.getMinutes() + 60);

    const token = jwt.sign({ userId: user.userId }, "secret-key");

    res.cookie("authorization", `Bearer ${token}`, { expires: expires });
    return res
      .status(200)
      .json({ message: `${nickname}님은 로그인에 성공하였습니다.` });
  } catch (err) {
    return res.status(400).send({
      errorMessage: "로그인에 실패하였습니다.",
    });
  }
});
module.exports = router;
