var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const ArticleDao = require("../dao/articleDao");

// 获取文章
router.get(
  "/",
  [
    check("current").notEmpty().withMessage("缺少参数：current"),
    check("pageSize").notEmpty().withMessage("缺少参数：pageSize"),
  ],
  async (req, res) => {
    let articleDao = new ArticleDao();
    const result = await articleDao.find(
      {},
      null,
      parseInt(req.query.current),
      parseInt(req.query.pageSize)
    );
    res.json({ status: 200, result: result });
  }
);

// 创建文章
router.post(
  "/create",
  [
    check("title").notEmpty().withMessage("缺少参数：title"),
    check("title").isLength({ max: 200 }).withMessage("最多200个字符！"),
    check("content").notEmpty().withMessage("缺少参数：content"),
    check("type").notEmpty().withMessage("缺少参数：type"),
    check("auth").notEmpty().withMessage("缺少参数：auth"),
    check("category").notEmpty().withMessage("缺少参数：category"),
  ],
  async (req, res) => {
    // 校验
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    let articleDao = new ArticleDao();
    try {
      // 创建
      const result = await articleDao.create({
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        auth: req.body.auth,
        category: req.body.category,
        tag: req.body.tag,
      });
      res.json({ status: 200, result: result });
    } catch (error) {
      res.json({
        status: 500,
        error,
        msg: error && error.code === 11000 ? "该文章已存在！" : "服务出错！",
      });
    }
  }
);

// 修改文章
router.post(
  "/update",
  [
    check("_id").notEmpty().withMessage("缺少_id！"),
    check("updater").notEmpty().withMessage("缺少参数updater"),
  ],
  async (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    try {
      let articleDao = new ArticleDao();
      // 更新
      const result = await articleDao.update(
        { _id: req.body._id },
        req.body.updater
      );
      res.json({ status: 200, result: result });
    } catch (error) {
      res.json({
        status: 500,
        error,
        msg: error && error.code === 11000 ? "该文章已存在！" : "服务出错！",
      });
    }
  }
);

// 删除文章
router.delete(
  "/delete",
  [check("_id").notEmpty().withMessage("缺少_id！")],
  async (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    try {
      let articleDao = new ArticleDao();
      // 删除
      const result = await articleDao.deleteOne({ _id: req.body._id });
      res.json({ status: 200, result: result });
    } catch (error) {
      res.json({
        status: 500,
        error,
        msg: "服务出错！",
      });
    }
  }
);

module.exports = router;
