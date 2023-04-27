const express = require("express");
const { Comments } = require("../models");
const Joi = require("joi");

const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const { Op } = require("sequelize");

//댓글 정규표현식 + 검수작업 (from 시험문제)
const RE_COMMENT = /^[\s\S]{1,100}$/; // 댓글 정규 표현식
const commentSchema = Joi.object({
  comment: Joi.string().pattern(RE_COMMENT).required(),
});

// 댓글 생성 api
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const commentCheck = commentSchema.validate(req.body);
    if (commentCheck.error) {
      return res.status(412).json({
        errorMessage: "입력한 데이터 형식이 올바르지 않습니다.",
      });
    }
    const { userId, nickname } = res.locals.user;
    const { comment } = req.body;
    const { postId } = req.params;
    if (!comment) {
      return res.status(412).json({
        errorMessage: "댓글 내용을 입력하세요.",
      });
    }
    if (!postId) {
      return res.status(404).json({
        errorMessage: "게시글이 존재하지 않습니다.",
      });
    }
    await Comments.create({
      PostId: postId,
      UserId: userId,
      comment: comment,
      nickname: nickname,
    });
    return res.status(201).json({ message: " 댓글 작성에 성공하였습니다." });
  } catch (err) {
    res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
  }
});

// 댓글 목록 조회api
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comments.findAll({
      attributes: [
        "commentId",
        "userId",
        "nickname",
        "comment",
        "createdAt",
        "updatedAt",
      ],
      oreder: [["created", "DESC"]],
      //desc내림차순 / asc오름차순
    });
    return res.status(200).json({ comments: comments });
  } catch (err) {
    res.status(400).json({ errorMessage: "댓글글 조회에 실패하였습니다." });
  }
});

// 댓글 수정api
router.put(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = res.locals.user;
      const { comment } = req.body;
      const existComments = await Comments.findOne({ where: { commentId } });

      if (!existComments) {
        return res
          .status(403)
          .json({ errorMessage: "댓글이 존재하지 않습니다." });
      }

      // 댓글의 권한을 확인하고, 게시글을 수정합니다.
      const updateCheck = await Comments.update(
        { comment },
        { where: { commentId, PostId: postId, UserId: userId } }
      );
      if (updateCheck < 1) {
        return res.status(400).json({
          errorMessage: "댓글 수정이 정상적으로 진행되지 않았습니다.",
        });
      }
      return res.status(200).json({ message: "댓글이 수정되었습니다." });
    } catch (err) {
      res.status(400).json({ errorMessage: "댓글 수정에 실패하였습니다." });
    }
  }
);

// 댓글 삭제api
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    // try {
    const { postId, commentId } = req.params;
    const { userId } = res.locals.user;

    // 게시글 존재여부 확인
    const existComments = await Comments.findOne({ where: { commentId } });

    if (!existComments) {
      return res
        .status(404)
        .json({ errorMessage: "댓글이 존재하지 않습니다." });
    }

    const commentDelete = await Comments.destroy({
      where: {
        commentId,
        UserId: userId,
        PostId: postId,
      },
    });
    if (commentDelete < 1) {
      return res
        .status(400)
        .json({ errorMessage: "댓글이 정상적으로 삭제되지 않았습니다." });
    }
    return res.status(200).json({ message: "댓글이 삭제되었습니다." });
    // } catch (err) {
    //   return res
    //     .status(400)
    //     .json({ errorMessage: "댓글 삭제에 실패하였습니다." });
    // }
  }
);

module.exports = router;
