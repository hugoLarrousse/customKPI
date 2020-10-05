const express = require('express');

const middlewares = require('../middlewares');
const Kpis = require('../modules/kpi');

const router = express.Router();

router.use('/', middlewares.checkToken);

router.get('/', middlewares.checkFields, async (req, res, next) => {
  try {
    res.send({ success: true, data: await Kpis.getAll(req.user.orgaId) });
  } catch (e) {
    next(`${__filename}| ${req.method} ${req.baseUrl}${req.route.path} | ${e.message} | fail get Kpis`);
  }
});

router.get('/:kpiId', middlewares.checkFields, async (req, res, next) => {
  try {
    res.send({ success: true, data: await Kpis.getOne(req.user.orgaId, req.params.kpiId) });
  } catch (e) {
    next(`${__filename}| ${req.method} ${req.baseUrl}${req.route.path} | ${e.message} | 'cannot get this Kpi'`);
  }
});

router.post('/value', middlewares.checkFields, async (req, res, next) => {
  try {
    res.send({ success: true, data: await Kpis.addValue(req.user.orgaId, req.body.kpiId, req.body.value) });
  } catch (e) {
    next(`${__filename}| ${req.method} ${req.baseUrl}${req.route.path} | ${e.message} | 'fail add new value to your Kpi'`);
  }
});

module.exports = router;
