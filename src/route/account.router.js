import express from "express";
import { usersPrisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

//회원가입 API
router.post('/register', async (req, res, next) => {
  try {
    const { loginId, password, checkpassword} = req.body;

    if (!loginId) {
      return res.status(400).json({ errorMessage: 'id를 입력해주세요.' });
    }

    if (!password) {
      return res.status(400).json({ errorMessage: 'password를 입력해주세요.' });
    }

    // 아이디 중복 확인
    const isExistUserId = await usersPrisma.users.findFirst({
      where: { loginId },
    });
    if (isExistUserId) {
      return res
        .status(409)
        .json({ errorMessage: "이미 존재하는 아이디입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //유저 데이터 저장
    await usersPrisma.users.create({
      data: {
        loginId,
        password: hashedPassword,
      },
    });

    return res
      .status(201)
      .json({ 
        message: "회원가입이 완료되었습니다."
    });
  } catch (error) {
    return res.status(500).json({
      message: "에러가 발생했습니다.",
      error: error.message,
    });
  }
});

//로그인 API
router.post('/login', async (req, res, next) => {
  try {
    const { loginId, password } = req.body;

    //유저 존재 유무 확인
    const account = await usersPrisma.users.findUnique({
      where: { loginId },
    });
    if (!account) {
      return res
        .status(401)
        .json({ errorMessage: "존재하지 않는 아이디입니다." });
    }

    //2) 비밀번호 확인
    if (!(await bcrypt.compare(password, account.password))) {
      return res
        .status(401)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    // 3) jwt 토큰 생성
    const token = jwt.sign(
      {
        loginId: account.loginId,
      }
    );

    res.cookie("authorization", `Bearer ${token}`);
    return res.status(200).json({ message: "로그인에 성공했습니다." });
  } catch (error) {
    return res.status(500).json({
      message: "에러가 발생했습니다.",
      error: error.message,
    });
  }
});

export default router;
