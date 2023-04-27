const express = require("express");
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const { Op } = require("sequelize")

// 게시글 생성 api
router.post("/posts", authMiddleware, async (req, res) => {
    try {
    const { userId, nickname } = res.locals.user;
    const { title, content } = req.body;

    const post = await Posts.create({
        UserId: userId,
        title,
        content,
        nickname,
    });
    return res.status(201).json({ message: " 게시글 작성에 성공하였습니다." });
   
} catch (err) {
        res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
    };
});

// 게시글 목록 조회api
router.get("/posts", async (req, res) => {
    try {
        const posts = await Posts.findAll({
            attributes: ["postId", "userId", "nickname", "title","content", "createdAt", "updatedAt"],
            order: [['createdAt', 'DESC']],
            //order = 정렬, desc내림차순 / asc오름차순
        });
        return res.status(200).json({ data: posts });
    
    } catch (err) {
        res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    };
});

//게시글 상세조회 api
router.get("/posts/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Posts.findOne({
            where: { postId },
            attributes: ["postId", "userId", "nickname", "title", "content", "createdAt", "updatedAt"]
        });
        return res.status(200).json({ data: post })
    
    } catch (err) {
        res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    };
});

// 게시글 수정api
router.put("/posts/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user;
        const { title, content } = req.body;

        const post = await Posts.findOne({ where: { postId } });

        if (!post) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        } else if (post.UserId !== userId) {
            return res.status(401).json({ errorMessage: "권한이 없습니다." });
        };
        if (!title) {
            return res.status(412).json({ errorMessage: "제목을 작성해주세요" })
        };
        if (!content) {
            return res.status(412).json({ errorMessage: "게시글 내용을 작성해주세요" })
        };
        // 게시글의 권한을 확인하고, 게시글을 수정합니다.
        await Posts.update(
            { title, content }, // title과 content 컬럼을 수정합니다.
            {
                where: {
                    [Op.and]: [{ postId }, { UserId: userId }],
                }
            }
        );
        return res.status(200).json({ message: "게시글이 수정되었습니다." });
    
    } catch (err) {
        res.status(400).json({ errorMessage: "게시글 수정에 실패하였습니다." });
    };
});

// 게시글 삭제api
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user;

        // 게시글 존재여부 확인
        const post = await Posts.findOne({ where: { postId } });

        if (!post) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        } else if (post.UserId !== userId) {
            return res.status(401).json({ errorMessage: "권한이 없습니다." });
        }

        // 게시글의 권한을 확인하고, 게시글을 삭제합니다.
        await Posts.destroy({
            where: {
                [Op.and]: [{ postId }, { UserId: userId }],
            }
        });
        return res.status(200).json({ message: "게시글이 삭제되었습니다." });
   
    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 삭제에 실패하였습니다." })
    };
});

module.exports = router;