var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const ArticleDao = require("../dao/articleDao");

// 获取文章
router.get("/", async (req, res) => {
  try {
    const keyword = req.query.keyword;
    let articleDao = new ArticleDao();
    const result = await articleDao.find(
      keyword
        ? {
            $or: [
              { title: eval("/" + keyword + "/i") },
              { content: eval("/" + keyword + "/i") },
            ],
          }
        : {},
      null,
      req.query.current ? parseInt(req.query.current) : undefined,
      req.query.pageSize ? parseInt(req.query.pageSize) : undefined
    );
    res.json({ status: 200, result: result });
  } catch (error) {
    res.json({
      status: 500,
      error,
      msg: "服务出错！",
    });
  }
});

// 根据id获取文章
router.get("/findById", async (req, res) => {
  try {
    let articleDao = new ArticleDao();
    const result = await articleDao.findById(req.query._id);
    res.json({ status: 200, result: result });
  } catch (error) {
    res.json({
      status: 500,
      error,
      msg: "服务出错！",
    });
  }
});

// 根据id获取文章
router.get("/findByIdDetail", async (req, res) => {
  try {
    let articleDao = new ArticleDao();
    const result = await articleDao.findByIdDetail(req.query._id);
    res.json({ status: 200, result: result });
  } catch (error) {
    res.json({
      status: 500,
      error,
      msg: "服务出错！",
    });
  }
});

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
        cover: req.body.cover,
        snippet: req.body.snippet,
        content: req.body.content,
        type: req.body.type,
        auth: req.body.auth,
        category: req.body.category,
        tags: req.body.tags,
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

// 文章阅读数加1
router.post(
  "/incCount",
  [check("_id").notEmpty().withMessage("缺少_id！")],
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
        { $inc: { viewCount: 1 } }
      );
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
        { ...req.body.updater, updateTime: new Date() }
      );
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

// 测试
router.get("/test", async (req, res) => {
  try {
    let articleDao = new ArticleDao();
    const result = await articleDao.categoryArticleCount();
    res.json({ status: 200, result: result });
  } catch (error) {
    res.json({
      status: 500,
      error,
      msg: "服务出错！",
    });
  }
});

module.exports = router;
