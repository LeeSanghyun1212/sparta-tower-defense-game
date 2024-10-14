import express from "express";
import { usersPrisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

//회원가입 API
router.post("/register", async (req, res, next) => {
  try {
    const { user_id, password, checkpassword} = req.body;

    // 아이디 중복 확인
    const isExistUserId = await usersPrisma.users.findFirst({
      where: { user_id },
    });
    if (isExistUserId) {
      return res
        .status(409)
        .json({ errorMessage: "이미 존재하는 아이디입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //비밀번호 확인
    if (password !== checkpassword) {
      return res.status(400).json({
        errormessage: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
      });
    }

    //유저 데이터 저장
    const account = await usersPrisma.users.create({
      data: {
        user_id,
        password: hashedPassword,
      },
    });

    // 유저 데이터 반환
    const accountData = {
      user_id: account.user_id, // Corrected typo
    };

    return res
      .status(201)
      .json({ message: "회원가입이 완료되었습니다.", accountData });
  } catch (error) {
    return res.status(500).json({
      message: "에러가 발생했습니다.",
      error: error.message,
    });
  }
});

//로그인 API
router.post("/login", async (req, res) => {
  try {
    const { user_id, password } = req.body;

    //유저 존재 유무 확인
    const account = await usersPrisma.users.findFirst({
      where: { user_id },
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
        user_id: account.user_id,
      },
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
